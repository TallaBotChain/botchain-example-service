namespace :developers do

  desc "Checking developers registration status"
  task :check_status, [:network_name] => :environment do |task, args|
    args.with_defaults(:network_name => "kovan")
    puts "############ [#{args.network_name}]Checking developers registration status"
    developer_registry = DeveloperRegistry.new(args.network_name)
    network_id = developer_registry.eth_networks_config[args.network_name]['network_id']
    events = developer_registry.events.select {|e| 'ApprovalGranted' == e.name}
    filter_events = [events.map{|e| "0x#{e.signature}"}]
    to_block = developer_registry.last_block
    ids = developer_registry.get_event_logs(filter_events, 0, to_block)["result"].map{|l| l["data"].to_i(16)}

    curation_council = nil
    last_block = nil
    sanitized_join = ActiveRecord::Base.sanitize_sql_array(["LEFT JOIN registrations ON registrations.user_id = users.id AND registrations.network_id = #{network_id}"])
    User.joins(sanitized_join).where("registrations.user_id IS NULL OR registrations.status_was_sent IS FALSE").find_each do |user|
      registration = user.registrations.find_or_create_by!({network_id: network_id})
      # puts "############ Checking developer address: #{user.eth_address}"
      if registration.entry_id == 0
        entry_id = developer_registry.getDeveloperId(user.eth_address)
        if entry_id && entry_id > 0
          puts "Updating developer entry id [#{entry_id}] for user: [#{user.email}]"
          registration.update_columns({entry_id: entry_id})
        end
      end
      next if registration.entry_id == 0 # developer not registered yet

      if ids.include?(registration.entry_id)
        puts "Sending approved status by email for user: [#{user.email}]"
        RegistrationStatusMailer.with(user: user).developer_approved.deliver_now
        registration.update_columns({status: Registration.statuses['approved'], status_was_sent: true})
      else
        # puts "doing extra check!"
        curation_council ||= CurationCouncil.new(args.network_name)
        last_block ||= curation_council.last_block
        if registration.vote_final_block.nil?         
          vote_id = curation_council.getRegistrationVoteIdByAddress(user.eth_address)
          vote_final_block = curation_council.getVoteFinalBlock(vote_id)
          if vote_final_block && vote_final_block > 0
            puts "Updating vote final block for developer entry id: #{registration.entry_id}"
            registration.update_columns({vote_final_block: vote_final_block}) 
          end
        end
        next if registration.vote_final_block.nil? # developer registration vote not submitted yet
        
        if registration.vote_final_block < last_block
          puts "Sending rejected status by email for user: [#{user.email}]"
          RegistrationStatusMailer.with(user: user).developer_rejected.deliver_now
          registration.update_columns({status: Registration.statuses['rejected'], status_was_sent: true})
        end
      end
    end
  end

end

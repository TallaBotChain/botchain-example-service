namespace :developers do

  desc "Checking developers registration status"
  task check_status: :environment do 
    puts "############ Checking developers registration status"
    developer_registry = DeveloperRegistry.new
    events = developer_registry.events.select {|e| 'ApprovalGranted' == e.name}
    filter_events = [events.map{|e| "0x#{e.signature}"}]
    to_block = developer_registry.last_block
    ids = developer_registry.get_event_logs(filter_events, 0, to_block)["result"].map{|l| l["data"].to_i(16)}
    
    curation_council = nil
    last_block = nil
    User.where(registration_status_was_sent: false).find_each do |user|
      # puts "############ Checking developer address: #{user.eth_address}"
      if user.developer_entry_id == 0
        entry_id = developer_registry.getDeveloperId(user.eth_address)
        if entry_id && entry_id > 0
          puts "Updating developer entry id [#{entry_id}] for user: [#{user.email}]"
          user.update_columns({developer_entry_id: entry_id}) if entry_id && entry_id > 0
        end
      end
      next if user.developer_entry_id == 0 # developer not registered yet

      if ids.include?(user.developer_entry_id)
        puts "Sending approved status by email for user: [#{user.email}]"
        RegistrationStatusMailer.with(user: user).developer_approved.deliver_now
        user.update_columns({registration_status: User.registration_statuses['approved'], registration_status_was_sent: true})
      else
        # puts "doing extra check!"
        curation_council ||= CurationCouncil.new
        last_block ||= curation_council.last_block
        if user.registration_vote_final_block.nil?         
          vote_id = curation_council.getRegistrationVoteIdByAddress(user.eth_address)
          vote_final_block = curation_council.getVoteFinalBlock(vote_id)
          if vote_final_block && vote_final_block > 0
            puts "Updating vote final block for developer entry id: #{user.developer_entry_id}"
            user.update_columns({registration_vote_final_block: vote_final_block}) 
          end
        end
        next if user.registration_vote_final_block.nil? # developer registration vote not submitted yet
        
        if user.registration_vote_final_block < last_block
          puts "Sending rejected status by email for user: [#{user.email}]"
          RegistrationStatusMailer.with(user: user).developer_rejected.deliver_now
          user.update_columns({registration_status: User.registration_statuses['rejected'], registration_status_was_sent: true})
        end
      end
    end
  end

end

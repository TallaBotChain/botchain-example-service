namespace :developers do

  desc "Checking developers registration status"
  task check_status: :environment do 
    developer_registry = DeveloperRegistry.new
    events = developer_registry.events.select {|e| 'ApprovalGranted' == e.name}
    filter_events = [events.map{|e| "0x#{e.signature}"}]
    to_block = developer_registry.last_block
    ids = developer_registry.get_event_logs(filter_events, 0, to_block)["result"].map{|l| l["data"].to_i(16)}
    
    curation_council = nil
    last_block = nil
    User.where(registration_status_was_sent: false).find_each do |user|
      puts "############ Checking developer address: #{user.eth_address}"
      if user.developer_entry_id.nil?
        puts "Updating developer entry id for developer address: #{user.eth_address}"
        entry_id = developer_registry.getDeveloperId(user.eth_address)
        user.update_columns({developer_entry_id: entry_id}) if entry_id && entry_id > 0
      end
      next if user.developer_entry_id.nil? # developer not registered yet

      if ids.include?(user.developer_entry_id)
        puts "Sending approved status by email"
        RegistrationStatusMailer.with(user: user).developer_approved.deliver_later
        user.update_columns({registration_status: true, registration_status_was_sent: true})
      else
        puts "doing extra check!"
        curation_council ||= CurationCouncil.new
        last_block ||= curation_council.last_block
        if user.registration_vote_final_block.nil?
          puts "Updating vote final block for developer entry id: #{user.developer_entry_id}"
          vote_id = curation_council.getRegistrationVoteIdByAddress(user.eth_address)
          vote_final_block = curation_council.getVoteFinalBlock(vote_id)
          user.update_columns({registration_vote_final_block: vote_final_block}) if vote_final_block && vote_final_block > 0
        end
        next if user.registration_vote_final_block.nil? # developer registration vote not submitted yet
        
        if user.registration_vote_final_block < last_block
          puts "Sending rejected status by email"
          RegistrationStatusMailer.with(user: user).developer_rejected.deliver_later
          user.update_columns({registration_status_was_sent: true})
        end
      end
    end
  end

end

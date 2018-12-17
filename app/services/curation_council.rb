class CurationCouncil < Blockchain

  def initialize()
    super
    artifacts = JSON.parse(File.read( Rails.root.join('app/javascript/blockchain/abi/CurationCouncilRegistryDelegate.json') ) )
    @abi = artifacts["abi"].to_json
    @contract = Ethereum::Contract.create(client: client, name: "CurationCouncil", address: Rails.application.config.x.curation_council_contract, abi: abi)
  end

  def getRegistrationVoteIdByAddress(address)
    self.contract.call.get_registration_vote_id_by_address(address)
  end

  def getVoteFinalBlock(vote_id)
    self.contract.call.get_vote_final_block(vote_id)
  end

end

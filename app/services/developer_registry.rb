class DeveloperRegistry < Blockchain

  def initialize(network_name)
    super(network_name)
    artifacts = JSON.parse(File.read( Rails.root.join('app/javascript/blockchain/abi/DeveloperRegistryDelegate.json') ) )
    @abi = artifacts["abi"].to_json
    @contract = Ethereum::Contract.create(client: client, name: "DeveloperRegistry", address: eth_networks_config[network_name]['developer_registry_contract'], abi: abi)
  end

  def getDeveloperId(address)
    self.contract.call.owns(address)
  end

end

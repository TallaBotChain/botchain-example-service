class Blockchain
  attr_reader :client, :contract, :abi
  
  def initialize(network_name)
    raise ArgumentError, "Network with name: '#{network_name}' is not defined in config/eth_networks.yml" unless eth_networks_config.has_key?(network_name)
    @client = Ethereum::HttpClient.new(eth_networks_config[network_name]['geth_rpc'])
  end

  def eth_networks_config
    @eth_networks_config ||= Rails.application.config_for(:eth_networks)['networks']
  end

  def last_block
    client.eth_block_number()["result"].to_i(16)
  end

  def events
    @events ||= contract.abi.select {|x| x["type"] == "event" }.map { |evt| Ethereum::ContractEvent.new(evt) }
  end

  #topics are order-dependent. Details can be found here:
  #https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter
  def get_event_logs(topics = [], fromBlock, toBlock)
    filter = {
      topics: topics,
      fromBlock: "0x" + fromBlock.to_s(16),
      toBlock: "0x" + toBlock.to_s(16),
      address: contract.address
    }
    client.eth_get_logs(filter)
  end

end

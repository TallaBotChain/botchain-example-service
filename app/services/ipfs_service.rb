require 'rest_client'

class IPFSService

  def add_json(input_json)
    input_json = input_json.to_json if input_json.class == Hash
    metadata2upload = StringIOAsFile.new('metadata.json', input_json)
    response = RestClient.post 'https://ipfs.infura.io:5001/api/v0/add', myfile: metadata2upload
    body = JSON.parse(response.body)
    body['Hash']
  end

  def get_json(ipfs_hash)
    response = RestClient.get 'https://ipfs.infura.io:5001/api/v0/cat', params: {arg: ipfs_hash}
    response.body
  end
end

require 'webrick/httputils'

class StringIOAsFile < StringIO
  attr_accessor :file_path

  def initialize(*args)
    super(*args[1..-1])
    @file_path = args[0]
  end

  def original_filename
    File.basename(file_path)
  end

  def content_type
    content_type = Rack::Mime.mime_type(File.extname(file_path))
  end

  def path
    file_path
  end
end

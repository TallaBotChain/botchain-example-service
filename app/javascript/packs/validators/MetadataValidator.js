export class MetadataValidator {

  constructor(required_fields) {
    this.required_fields = required_fields
  }

  // fetch metadata from url.
  static fetch(url, props){
    $.get(url,null,null,'text').then((response) => {
      props.dispatch(props.change("metadata", response))
    })
    return Promise.resolve();
  }

  validate(metadata) {
    try {
      metadata = JSON.parse(metadata)
    } catch (e) {
      return "Metadata is not valid JSON.";
    }
    for (var i = 0; i < this.required_fields.length; i++) {
      if(!metadata[this.required_fields[i]]){
        return 'Required attributes are missing.'
      }
    }
    return undefined
  }
}

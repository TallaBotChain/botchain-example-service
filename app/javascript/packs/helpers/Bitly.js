const BITLY_API_URL = "https://api-ssl.Bitly.com/v4/shorten"

export class Bitly {

  static shorten(url){
    return new Promise(function(resolve, reject) {
      $.ajax({
        method: "POST",
        url: BITLY_API_URL,
        data: JSON.stringify({"long_url": url, "group_guid": window.app_config.bitly_group_guid}),
        headers: {"Authorization": `Bearer ${window.app_config.bitly_access_token}`},
        contentType: "application/json"
      })
      .done(( response ) => {
        resolve(response.link)
      })
      .fail(( error ) => {
        reject(error)
      });

    });
  }

}

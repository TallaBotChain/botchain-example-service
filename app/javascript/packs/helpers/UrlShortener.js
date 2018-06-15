const SHORTENER_API_URL = "https://www.googleapis.com/urlshortener/v1/url"

export class UrlShortener {

  static shorten(url) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        method: "POST",
        url: `${SHORTENER_API_URL}?key=${window.app_config.urlshortener_api_key}`,
        data: JSON.stringify({"longUrl": url}),
        contentType: "application/json"
      })
      .done(( response ) => {
        resolve(response.id)
      })
      .fail(( error ) => {
        reject("Failed to shorten url")
      });

    });
  }

}

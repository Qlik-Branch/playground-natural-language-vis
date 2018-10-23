let config = {}
Playground.notify({
	title: "Please wait...",
	message: "Connecting"
})
// Change the schema version below as necessary to match your environment
getSchema("12.170.2").then(schema => {
	config.schema = schema
	return Playground.authenticate(config, "ticket")
}).then(function(ticket){
  config.url += `?qlikTicket=${ticket}`
	const session = enigma.create(config)
  session.open().then(global => {		
		global.openDoc(config.appname).then(app => {
			senseSearch.usePicasso = true
      senseSearch.connectWithEnigma(app)
      var inputOptions = {
         includeMasterMeasures: true,
				 placeholder: 'What would you like to know?'
      }
      senseSearch.inputs["searchInput"].attach(inputOptions)
      // senseSearch.inputs["searchInput"].addFieldTag("month", "$time");
      senseSearch.results["searchResults"].onUnsupportedVisualization.subscribe(obj => {
        Playground.notification.deliver({
					title: "Not supported",
					message: "The specified visualization is not currently supported",
					duration: 3000
				})				
      })
		})    
  })
})

function getSchema(version) {
	return new Promise((resolve, reject) => {
	    const xhr = new XMLHttpRequest()
	    xhr.open("GET", `/node_modules/enigma.js/schemas/${version}.json`)
			xhr.setRequestHeader("Access-Control-Allow-Origin","http://localhost:8000");
	    xhr.onload = () => resolve(JSON.parse(xhr.responseText))
	    xhr.onerror = () => reject(xhr.statusText)
	    xhr.send()
	  })
}

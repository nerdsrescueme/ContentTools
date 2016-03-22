window.onload = () ->

    if !window.CONTENT_ENDPOINT || !window.WORKFLOW_ENDPOINT
        console.log 'Unable to initialize editor, no endpoints found.'
        return

    ContentTools.IMAGE_UPLOADER = ImageUploader.createImageUploader

    # Build a palette of styles
    ContentTools.StylePalette.add([
        new ContentTools.Style('By-line', 'article__by-line', ['p']),
        new ContentTools.Style('Caption', 'article__caption', ['p']),
        new ContentTools.Style('Example', 'example', ['pre']),
        new ContentTools.Style('Example + Good', 'example--good', ['pre']),
        new ContentTools.Style('Example + Bad', 'example--bad', ['pre'])
        ])

    editor = ContentTools.EditorApp.get()
    owner = document.querySelector('div[about^="phpcr|"]')

    if !owner
        console.log 'Unable to initialize editor, no owner document found.'
        return

    # Assign attributes from owner
    schema = owner.getAttribute('xmlns:schema')
    subject = owner.getAttribute('about')
    type = owner.getAttribute('typeof').replace('schema:', schema)

    if !schema || !subject || !type
        console.log 'Unable to initialize editor, owner data is not complete.'
        return

    putEndpoint = "#{window.CONTENT_ENDPOINT}/#{subject}"

    # Let's grab the editable regions
    properties = document.querySelectorAll('*[property^="schema:"]')

    editor.init(properties, 'property')

    editor.addEventListener 'saved', (ev) ->

      regions = ev.detail().regions

      if (0 == Object.keys(regions).length)
          new ContentTools.FlashUI('ok')
          return

      # Mark the ignition as busy while we save the page
      editor.busy(true)

      # Create output by iterating regions
      outputData = {}
      outputData['@subject'] = "<#{subject}>"
      outputData['@type'] = "<#{type}>"

      for region, content of regions
          def = region.replace('schema:', schema)
          outputData["<#{def}>"] = content

      # Create xhr request function
      saved = (to) ->
          xhr = new XMLHttpRequest()

          xhr.addEventListener 'readystatechange', () ->
              if xhr.readyState is 4 # ReadyState Complete
                  successResultCodes = [200]
                  if xhr.status in successResultCodes
                      data = JSON.parse xhr.responseText
                      console.log 'data message: ', data.message
                      editor.busy(false)
                      new ContentTools.FlashUI('ok')
                  else
                      console.log 'Error loading data...'
                      editor.busy(false)
                      new ContentTools.FlashUI('no')

          xhr.open 'PUT', to, false
          xhr.setRequestHeader 'Content-Type', 'application/json;charset=UTF-8'
          xhr.setRequestHeader 'Accept', 'application/json'
          xhr.setRequestHeader 'X-Requested-With', 'XMLHttpRequest'
          xhr.send(JSON.stringify(outputData))

      # Do it!
      saved putEndpoint

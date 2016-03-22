BaseEditorApp = ContentTools.EditorApp.getCls()

class WebmaxEditor extends BaseEditorApp

  constructor: () ->
    super()

    @_actionBar = null

  init: (queryOrDOMElements, namingProp='id') ->
    super(queryOrDOMElements, namingProp)

    @_actionBar = new ContentTools.ActionBarUI()
    @attach(@_actionBar)

  start: () ->
    super()

    @_actionBar.show()

  stop: (save) ->
    super(save)

    @_actionBar.hide()

  unmount: () ->
    super()

    @_actionBar = null

# Overload the editor to get our custom editor

ContentTools.EditorApp.getCls = () ->
  return WebmaxEditor

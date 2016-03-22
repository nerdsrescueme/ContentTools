class ContentTools.ActionBarUI extends ContentTools.WidgetUI

  # The actions UI provides a JS based attach point for displaying the possible
  # actions able to be taken for a given content page. This does NOT include the
  # ContentTools editor, but other actions that are framework dependent.

  constructor: () ->
    super()

    @_actions = []

  mount: () ->

    @_domElement = @constructor.createDiv(['ct-widget', 'ct-action-bar'])
    @parent().domElement().appendChild(@_domElement)

    @_domActions = @constructor.createDiv([
      'ct-action-bar__actions',
      'ct-actions'
      ])
    @_domElement.appendChild(@_domActions)

    @_addDOMEventListeners()

    if 0 == @_actions.length
      @addDefaultActions()

    for actionUI, i in @_actions
      actionUI.mount(@_domActions)

  unmount: () ->
    super()

    @_domActions = null

  addDefaultActions: () ->

    @_actions.push new ContentTools.ActionUI('addPage', 'Add page')
    @_actions.push new ContentTools.ActionUI('addBlock', 'Add block')
    @_actions.push new ContentTools.ActionUI('metadata', 'Manage metadata')


ContentTools.Actions = {
  addPage: (domElement, event) ->
    alert 'Show create page dialog'
  addBlock: (domElement, event) ->
    alert 'Show create block dialog'
  metadata: (domElement, event) ->
    alert 'Show manage metadata dialog'
}


class ContentTools.ActionUI extends ContentTools.AnchoredComponentUI

  # An action displayed in the action bar for performing given page actions

  constructor: (name, label, action) ->
    super()

    @name = name
    @label = label
    @action = action || () ->
      return

  mount: (domParent, before=null) ->
    @_domElement = @constructor.createDiv([
      'ct-action'
      'ct-action__button'
      'ct-action__button--' + @name
    ])

    # Add a tooltip
    @_domElement.setAttribute('data-tooltip', ContentEdit._(@label))

    super(domParent, before)

  _addDOMEventListeners: () ->

    @_domElement.addEventListener('mousedown', @_onMouseDown)

  _onMouseDown: (ev) =>
    ev.preventDefault()
    ContentTools.Actions[@name].call(this, @_domElement, ev)

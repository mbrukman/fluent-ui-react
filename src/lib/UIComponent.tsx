import * as React from 'react'
import renderComponent, { IRenderResultConfig } from './renderComponent'
import { ActionHandler } from './actions/Action'

abstract class UIComponent<P, S> extends React.Component<P, S> {
  private readonly childClass = this.constructor as typeof UIComponent
  static defaultProps: { [key: string]: any }
  static displayName: string
  static className: string
  static handledProps: any

  private actionHandlers: { [name: string]: (params: any) => void }

  constructor(props, context) {
    super(props, context)
    if (process.env.NODE_ENV !== 'production') {
      const child = this.constructor
      const childName = child.name

      if (typeof this.renderComponent !== 'function') {
        throw new Error(`${childName} extending UIComponent is missing a renderComponent() method.`)
      }
    }

    this.renderComponent = this.renderComponent.bind(this)
  }

  // state machine should be used instead, for now allow simple actions on components
  registerActionHandler<A>(handler: ActionHandler<A>) {
    this.actionHandlers = this.actionHandlers || {}
    this.actionHandlers[handler.name] = handler.call
  }

  executeAction<A>(args: { name: string; params: A }): void {
    if (this.actionHandlers && this.actionHandlers[args.name]) {
      this.actionHandlers[args.name](args.params)
    }
  }

  private keyHandlers: {
    [key: string]: (key: string, event: Event) => void
  }

  protected handleKey(key: string, callback: (key: string, event: Event) => void): void {
    this.keyHandlers = this.keyHandlers || {}
    this.keyHandlers[key] = callback
  }

  protected keyHandler(): object {
    return event => {
      if (this.keyHandlers && this.keyHandlers[event.which]) {
        this.keyHandlers[event.which](event.key, event)
      }
    }
  }

  renderComponent(config: IRenderResultConfig<P>): React.ReactNode {
    throw new Error('renderComponent is not implemented.')
  }

  render() {
    return renderComponent(
      {
        className: this.childClass.className,
        defaultProps: this.childClass.defaultProps,
        displayName: this.childClass.displayName,
        handledProps: this.childClass.handledProps,
        props: this.props,
        state: this.state,
      },
      this.renderComponent,
    )
  }
}

export default UIComponent

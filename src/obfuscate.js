import React, { Component } from 'react'

export default class Obfuscate extends Component {
  constructor(props) {
    super(props)

    this.state = {
      humanInteraction: false,
    }
  }

  // Convert contact information to contact URL scheme
  createContactLink(props) {
    let link

    // Combine email header parameters for use with email
    const combineHeaders = (params = {}) => {
      return Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')
    }

    if (props.email) {
      link = `mailto:${props.email}`

      if (props.headers) {
        link += `?${combineHeaders(props.headers)}`
      }
    } else if (props.tel) {
      link = `tel:${props.tel}`
    } else if (props.sms) {
      link = `sms:${props.sms}`
    } else if (props.facetime) {
      link = `facetime:${props.facetime}`
    } else {
      link = props.children
    }

    return link
  }

  handleClick(event) {
    event.preventDefault()
    window.location.href = this.createContactLink(this.props)
  }

  handleCopiability() {
    this.setState({
      humanInteraction: true,
    })
  }

  reverse(s) {
    return s
      .split('')
      .reverse()
      .join('')
      .replace('(', ')')
      .replace(')', '(')
  }

  render() {
    const { humanInteraction } = this.state
    const {
      component: Component = 'a',
      children,
      tel,
      sms,
      facetime,
      email,
      headers,
      obfuscate,
      linkText,
      viewOnly,
      style,
      ...others
    } = this.props

    const propsList = children || tel || sms || facetime || email

    const obsStyle = {
      ...(style || {}),
      unicodeBidi: 'bidi-override',
      direction:
        humanInteraction === true || obfuscate === false ? 'ltr' : 'rtl',
    }

    const link =
      humanInteraction === true || obfuscate === false
        ? propsList
        : this.reverse(propsList)

    const clickProps = viewOnly
      ? {}
      : {
          href:
            humanInteraction === true || obfuscate === false
              ? this.createContactLink(this.props)
              : linkText || 'obfuscated',
          onClick: this.handleClick.bind(this),
        }

    const props = {
      onFocus: this.handleCopiability.bind(this),
      onMouseOver: this.handleCopiability.bind(this),
      onContextMenu: this.handleCopiability.bind(this),
      ...clickProps,
      ...others,
      style: obsStyle,
    }

    return <Component {...props}>{link}</Component>
  }
}

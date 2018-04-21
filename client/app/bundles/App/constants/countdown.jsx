import React from 'react'
import moment from 'moment'
require("moment-duration-format")

export default class Countdown extends React.Component {

    constructor(props) {
        super(props)
        const self = this
        this.state = {
            timer: null,
            seconds: 60
        }
        self.componentWillMount = self.componentWillMount.bind(this)
        self.decrementCounter = self.decrementCounter.bind(this)
    }

    componentWillUnmount() {
        const self = this
        self.stop()
    }

    componentWillMount() {
        const self = this
        self.setState({
            seconds: self.props.seconds
        })
        self.start()
    }

    decrementCounter() {
        const self = this
        if (self.state.seconds === 0) {
            self.props.onEnd()
            self.stop()
        }
        self.setState({
            seconds: self.state.seconds > 0 ? ( self.state.seconds - 1 ) : 0
        })
    }

    start() {
        const self = this
        clearInterval(self.state.timer)
        self.setState({
            seconds: self.props.seconds,
            timer: setInterval(self.decrementCounter, 1000)
        })
    }

    stop() {
        const self = this
        clearInterval(self.state.timer)
    }

    render() {
        const self = this
        return (
            <span>{ moment.duration(self.state.seconds*1000).format("h:mm:ss") }</span>
        )
    }

}


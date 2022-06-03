import { useEffect, useRef, useState } from 'react'
import './CollapseWrapper.css'

export default function CollapseWrapper(props) {
    const wrapperRef = useRef();

    const [height, setHeight] = useState(0);

    useEffect(() => {
        if(!props.collapsed) {
            setHeight(wrapperRef.current.children[0].clientHeight);
        } else {
            setHeight(0);
        }
    }, [props.collapsed])

    return (
        <div ref={wrapperRef} style={{ height: height }}
        className={`collapseWrapper-root ${props.collapsed ? 'collapsed' : ''}`}>
            {props.children}
        </div>
    )
}
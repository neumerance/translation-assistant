export function scrollToMiddle(parent, child){
    const position = parent.scrollTop() + ( child.position().top - ( parent.height()/2 ) ) + ( child.height()/2 )
    scrollParentTop(parent, position)
}

export function scrollToTop(parent, child){
    const position = child.offset().top - parent.offset().top - parent.scrollTop()
    parent.stop().animate({ scrollTop: position }, '500', 'swing' )
}

export function scrollParentTop(parent, position) {
    parent.stop().animate({ scrollTop: position }, '500', 'swing' )
}
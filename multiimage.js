/* jshint esversion: 6 */
/* jshint node: true */
/* jshint browser: true */
/* jshint -W080 */
"use strict";

var collections = Array();

var modal       = undefined;
var modalClose  = undefined;
var modalImg    = undefined;
var modalAlt    = undefined;

class ImgCollection {
    constructor( elem, idx ) {
        let hrefs = elem.getElementsByTagName( 'a' );
        this.images = Array();
        this.mouseIsOver = 0;
        this.id = idx;
        this.visible = false;
        for ( let i = 0; i < hrefs.length; i++) {
            let images = elem.getElementsByTagName( 'img' );
            if ( images.length > 0 ) {
                let fullSize = document.createElement( 'img' );
                let divImg   = document.createElement( 'div' );
                divImg.setAttribute( 'style', 'background-image: url( "' + hrefs[ i ].href + '" )' );
                fullSize.src = hrefs[ i ].href;
                this.images.push( new Img( divImg, fullSize ) );
                this.images[ i ].preview.setAttribute( 'onmouseover', 'mouseIsOver(' + this.id + ');' );
                this.images[ i ].preview.setAttribute( 'onmouseout', 'mouseLeft(' + this.id + ');' );
            }
        }
        //elem.appendChild( preview );
        // this.images = images;
        this.width  = 0;
        this.height = 0;
    }

    get size() {
        return this.images.length;
    }

    get preview() {
        return document.getElementById( 'collection_' + this.id );
    }

    appendWrapper( root ) {
        let div = document.getElementById( 'collection_' + this.id );
        if ( div ) {
            root.appendChild( div );
        }
        else {
            div = document.createElement( 'div' );
            div.id = 'collection_' + this.id;
            div.setAttribute( 'class', 'imgWrapper' );
            for ( let i = 0; i < this.size; i++ ) {
                this.images[ i ].preview.style.opacity = 0;
                div.appendChild( this.images[i].preview );
            }
            root.appendChild( div );
            this.images[ 0 ].preview.style.opacity = 1;
            this.images[ 0 ].preview.setAttribute( 'onmouseover', 'imgHover(' + this.id + ');' );
            this.images[ 0 ].preview.setAttribute( 'onmouseout', 'imgLeave(' + this.id + ');' );
            div.setAttribute( 'onmouseover', 'mouseIsOver(' + this.id + ');' );
            div.setAttribute( 'onmouseout', 'mouseLeft(' + this.id + ');' );
        }
    }

    disapear() {
        let images = this.preview.getElementsByTagName( 'div' );
        this.visible = false;
        for ( let i = 1; i < images.length; i++ ) {
            images[ i ].style.opacity = 0;
            moveElement( images[ i ], 0, 0, 0, 0 );
        }
        if ( this.width && this.height  ) {
            images[ 0 ].style.position = 'relative';
            images[ 0 ].style.width  = this.width + 'px';
            images[ 0 ].style.height = this.height + 'px';
            images[ 0 ].style.backgroundSize = images[ 0 ].style.width + ' ' + images[ 0 ].style.height;
        }
        moveElement( images[ 0 ], 0, 0, 0, 0 );
    }

    apear( all ) {
        let images = this.preview.getElementsByTagName( 'div' );
        for ( let i = all ? 0 : 1; i < images.length; i++ ) {
            images[ i ].style.opacity = 1;
        }
    }

    lower() {
        this.preview.style.zIndex = 0;
    }

    upper() {
        this.preview.style.zIndex = 2;
    }

    hover() {
        function commonMove( collection, images ) {
            let x      = images.length - 1;
            // let circle = x % 4 == 0 ? x : x + 4 - ( x % 4 );
            let circle = x % 4 == 0 ? x - 4 : x - x % 4;
            let y      = circle / 4;
            let space  = ( y - 1 ) / 2;
            let hspace = ( collection.height + 5 ) * space;
            let vspace = ( collection.width + 5 ) * space;
            let bottom = hspace + collection.height;
            let right  = vspace - 5;
            let idx = 1;
            // posune obrazky nahoru
            let spacing = 5;
            for ( let i = 0; i < y; i++ ) {
                if ( moveElement( images[ idx ], 0, right, bottom, 0 ) ) {
                    idx++;
                }
                right -= collection.width + spacing;
            }
            // posune obrazku dolu
            bottom = -bottom - 10;
            right  = vspace - 5;
            for ( let i = 0; i < y; i++ ) {
                if ( moveElement( images[ idx ], 0, right, bottom, 0 ) ) {
                    idx++;
                }
                right -= collection.width + spacing;
            }
            // posun vlevo
            bottom = hspace - 5;
            right  = collection.width + vspace;
            for ( let i = 0; i < y; i++ ) {
                if ( moveElement( images[ idx ], 0, right, bottom, 0 ) ) {
                    idx++;
                }
                bottom -= collection.height + spacing;
            }
            // posun vpravo
            bottom = hspace - 5;
            right  = -right - 10;
            for ( let i = 0; i < y; i++ ) {
                if ( moveElement( images[ idx ], 0, right, bottom, 0 ) ) {
                    idx++;
                }
                bottom -= collection.height + spacing;
            }

            let cnt = 0;
            console.log( collection );
            right  = -vspace - collection.width;
            bottom = -hspace - collection.height;
            while ( cnt < 4 && idx < images.length ) {
                console.log( cnt );
                if ( cnt == 0 ) {
                    if ( moveElement( images[ idx ], 0, right - 10, -bottom, 0 ) ) {
                        console.log( [ right, bottom ] );
                        idx++;
                    }
                }
                else if ( cnt == 1 ) {
                    if ( moveElement( images[ idx ], 0, right - 10, bottom - 10, 0 ) ) {
                        idx++;
                    }
                }
                else if ( cnt == 2 ) {
                    if ( moveElement( images[ idx ], 0, -right, bottom - 10 , 0 ) ) {
                        idx++;
                    }
                }
                else {
                    if ( moveElement( images[ idx ], 0, -right, -bottom, 0 ) ) {
                        idx++;
                    }
                }
                cnt++;
            }

            images[ 0 ].style.width  = collection.width + 2*vspace + 'px';
            images[ 0 ].style.height = collection.height + 2*hspace + 'px';
            images[ 0 ].style.backgroundSize = images[ 0 ].style.width + ' ' + images[ 0 ].style.height;
            images[ 0 ].style.position = 'relative';
            moveElement( images[ 0 ], 0, vspace -5 , hspace -5, 0 );
        }

        if ( this.visible ) {
            return;
        }
        this.visible = true;
        console.log( this );
        if ( this.width == 0 || this.height == 0 ) {
            this.width  = this.images[ 0 ].preview.offsetWidth;
            this.height = this.images[ 0 ].preview.offsetHeight;
        }
        let images = this.preview.getElementsByTagName( 'div' );
        this.upper();
        for ( let i = 1; i < images.length; i++ ) {
            images[ i ].style.opacity = 1;
        }
        commonMove( this, images );
    }
}

class Img {
    constructor ( preview, fullSize ) {
        this.preview  = preview;
        this.preview.setAttribute( 'class', 'imgPreview' );
        preview.setAttribute( 'onclick', "modal.style.display = 'inline';modalImg.src = '" + fullSize.src + "';modalAlt.innerHTML='"+ fullSize.alt +"';" );
    }
}

function removeChilds( elem ) {
    while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
    }
}

function multiimage() {
    document.addEventListener( 'DOMContentLoaded', ( event ) => {
        addModal();
        idle();
        let elements = document.getElementsByClassName( 'multiimage' );
        for ( let i = 0; i < elements.length; i++) {
            let collection = new ImgCollection( elements[i], i );
            if ( collection.size < 1 ) {
                continue;
            }
            removeChilds( elements[ i ] );
            collection.appendWrapper( elements[ i ] );
            //let plus = document.createElement( 'span' );
            //plus.innerHTML = '&plus;';
            //plus.setAttribute( 'class', 'previewMark' );
            //elements[ i ].appendChild( plus );
            collections.push( collection );
        }
    });
}

function addModal() {
    modal = document.createElement( 'div' );
    modalClose = document.createElement( 'span' );
    modalImg   = document.createElement( 'img' );
    modalAlt   = document.createElement( 'div' );
    modal.id   = 'modal';
    modalClose.id  = 'close';
    modalClose.onclick = function() {
        modal.style.display = 'none';
    };
    modalClose.innerHTML = '&times;';
    modalImg.id    = 'modalImg';
    modalAlt.id    = 'alt';
    modal.appendChild( modalClose );
    modal.appendChild( modalImg );
    modal.appendChild( modalAlt );
    document.body.appendChild( modal );
}

function imgHover( id ) {
    for ( let i = 0; i < collections.length; i++ ) {
        if ( id != i ) {
            collections[ i ].disapear();
            collections[ i ].lower();
        }
    }
    collections[ id ].hover();
}

function hideAllImages( expect ) {
    for ( let i = 0; i < collections.length; i++ ) {
        collections[ i ].disapear();
        collections[ i ].lower();
    }
}

function imgLeave( id, timeout ) {
    function leave() {
        let diff = collections[ id ].mouseIsOver - Date.now();
        if ( collections[ id ].mouseIsOver >= 0 && diff < 0 ) {
            let images = collections[ id ].disapear();
        }
        else if ( diff >= 0 ) {
            imgLeave( id, diff );
        }
        else {
            imgLeave( id );
        }
    }
    if ( !timeout ) {
        timeout = 2500;
    }
    setTimeout( leave, timeout );
}

function mouseLeft( id ) {
    collections[ id ].mouseIsOver = Date.now() + 1000;
}

function mouseIsOver( id ) {
    collections[ id ].mouseIsOver = -1;
}

function idle() {
    function isNotIdle() {
        clearTimeout( time  );
        console.log( 'timeout is reset' );
        time = setTimeout( hideAllImages, 3000 );
    }
    let time = undefined;
    document.onmousemove = isNotIdle;
    document.onkeypress  = isNotIdle;
}

function moveElement( elem, top, right, bottom, left ) {
    let borders  = elem.getBoundingClientRect();
    let diffTop  = top - bottom;
    let diffLeft = left - right;

    if ( diffTop*(-1) >= borders.top || diffLeft * (-1) >= borders.left ) {
        return false;
    }
    elem.style.top = diffTop + 'px';
    elem.style.left = (left - right) + 'px';
    return true;
}
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

var closeTimer = { 'timeout' : 0, 'idx' : 0 };

class ImgCollection {
    constructor( elem, idx ) {
        let hrefs = elem.getElementsByTagName( 'a' );
        this.images = Array();
        this.mouseIsOver = 0;
        this.id = idx;
        this.visible = false;
        for ( let i = 0; i < hrefs.length; i++) {
            let images = hrefs[ i ].getElementsByTagName( 'img' );
            if ( images.length > 0 ) {
                let fullSize = document.createElement( 'img' );
                let divImg   = document.createElement( 'div' );
                divImg.setAttribute( 'style', 'background-image: url( "' + images[ 0 ].src + '" )' );
                //divImg.setAttribute( 'style', 'background-image: url( "' + hrefs[ i ].href + '" )' );
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
            let span = document.createElement( 'span' );
            span.innerHTML = this.size;
            div.id = 'collection_' + this.id;
            div.setAttribute( 'class', 'imgWrapper' );
            for ( let i = 0; i < this.size; i++ ) {
                this.images[ i ].preview.style.opacity = 0;
                this.images[ i ].preview.style.zIndex  = 1;
                div.appendChild( this.images[i].preview );
            }
            root.appendChild( div );
            this.images[ 0 ].preview.appendChild( span );
            this.images[ 0 ].preview.style.zIndex  = 2;
            this.images[ 0 ].preview.style.opacity = 1;
            //this.images[ 0 ].preview.innerHTML = this.size;
            this.images[ 0 ].preview.setAttribute( 'onmouseover', 'imgHover(' + this.id + ');' );
            this.images[ 0 ].preview.setAttribute( 'onmouseout', 'imgLeave(' + this.id + ');' );
            div.setAttribute( 'onmouseover', 'mouseIsOver(' + this.id + ');' );
            div.setAttribute( 'onmouseout', 'mouseLeft(' + this.id + ');' );
        }
    }

    close( force ) {
        if ( this.visible && !force ) {
            return 500;
        }

        let images = this.preview.getElementsByTagName( 'div' );
        this.visible = false;
        for ( let i = 1; i < images.length; i++ ) {
            images[ i ].style.opacity = 0;
            //images[ i ].style.top  = '0px';
            //images[ i ].style.left = '0px';
            moveElement( images[ i ], 0, 0, 0, 0 );
        }
        if ( this.width && this.height  ) {
            images[ 0 ].style.position = 'relative';
            //images[ 0 ].style.top  = '0px';
            //images[ 0 ].style.left = '0px';
            images[ 0 ].style.width  = this.width + 'px';
            images[ 0 ].style.height = this.height + 'px';
            //images[ 0 ].innerHTML = this.size;
            //images[ 0 ].style.backgroundSize = images[ 0 ].style.width + ' ' + images[ 0 ].style.height;
        }
        moveElement( images[ 0 ], 0, 0, 0, 0 );
        this.lower();
        return 0;
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
        this.preview.style.zIndex = 3;
    }

    hover() {
        function moveChilds( collection, images ) {
            function polygon() {
                let bottom = hspace + ( collection.height + spacing * ( steps - 1 )  ) * steps;
                let right  = vspace - spacing;
                // posune obrazky nahoru
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    right -= collection.width + spacing;
                }

                // posun vpravo
                bottom = hspace - spacing;
                right  = -( vspace + ( collection.width + spacing * ( steps + 1 ) ) * steps );
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    bottom -= collection.height + spacing;
                }


                // posune obrazku dolu
                bottom = -( hspace + ( collection.height + spacing * ( steps + 1 )  ) * steps );
                right  = vspace - spacing;
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    right -= collection.width + spacing;
                }

                // posun vlevo
                bottom = hspace - 5;
                right  = vspace + ( collection.width + spacing * ( steps - 1 ) ) * steps;
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    bottom -= collection.height + spacing;
                }

                let cnt = 0;
                right  = -vspace - ( collection.width + spacing * ( steps - 1 ) ) * steps;
                bottom = -hspace - ( collection.height + spacing * ( steps - 1 ) ) * steps;
                while ( cnt < 4 && idx < images.length ) {
                    if ( cnt == 0 ) {
                        if ( inPage( images[ idx ], 0, right - 2*spacing, -bottom, 0 ) ) {
                            moveElement( images[ idx++ ], 0, right - 2*spacing, -bottom, 0 );
                        }
                    }
                    else if ( cnt == 1 ) {
                        if ( inPage( images[ idx ], 0, right - 2*spacing, bottom - 2*spacing, 0 ) ) {
                            moveElement( images[ idx++ ], 0, right - 2*spacing, bottom - 2*spacing, 0 );
                        }
                    }
                    else if ( cnt == 2 ) {
                        if ( inPage( images[ idx ], 0, -right, bottom - 2 * spacing, 0  ) ) {
                            moveElement( images[ idx++ ], 0, -right, bottom - 2 * spacing, 0 );
                        }
                    }
                    else {
                        if ( inPage( images[ idx ], 0, -right, -bottom, 0 ) ) {
                            moveElement( images[ idx++ ], 0, -right, -bottom, 0 );
                        }
                    }
                    cnt++;
                }
            }

            function table( count ) {
                let bottom = count * ( spacing + collection.height );
                let right  = count * ( spacing + collection.width );
                let n      = count * 2 + 1;

                for (let i = 0; idx < images.length && i < n; i++) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    right -= spacing + collection.width;
                }
                right += spacing + collection.width;
                for ( let i = 1; idx < images.length && i < n; i++ ) {
                    bottom -= collection.height + spacing;
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                }

                for (let i = 1; idx < images.length && i < n; i++) {
                    right += spacing + collection.width;
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                }

                for ( let i = 2; idx < images.length && i < n; i++ ) {
                    bottom += collection.height + spacing;
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                }

                if ( idx < images.length ) {
                    table( count + 1 );
                }
            }

            let x      = images.length - 1;
            // let circle = x % 4 == 0 ? x : x + 4 - ( x % 4 );
            let circle = x % 4 == 0 ? x - 4 : x - x % 4;
            if ( circle < 4 ) {
                circle = 4;
            }
            let y      = circle / 4;
            let space  = ( y - 1 ) / 2;
            let spacing = 5;
            let hspace = ( collection.height + spacing ) * space;
            let vspace = ( collection.width + spacing ) * space;
            let steps = 1;
            let idx = 1;
            if ( inPage( images[ 0 ], 0, vspace + collection.width, hspace + collection.height, 0 ) ) {
                while ( steps <= 5 && idx < images.length ) {
                    polygon();
                    steps += 1;
                }
                images[ 0 ].style.position = 'relative';
                images[ 0 ].style.width  = collection.width + 2*vspace + 'px';
                images[ 0 ].style.height = collection.height + 2*hspace + 'px';
                //images[ 0 ].style.backgroundSize = images[ 0 ].style.width + ' ' + images[ 0 ].style.height;
                moveElement( images[ 0 ], 0, vspace -spacing , hspace - spacing, 0 );
            }
            else {
                //circle = Math.ceil( Math.sqrt( images.length ) );
                table(1);
            }
        }

        if ( this.visible ) {
            return;
        }
        this.visible = true;
        if ( this.width == 0 || this.height == 0 ) {
            this.width  = this.images[ 0 ].preview.offsetWidth;
            this.height = this.images[ 0 ].preview.offsetHeight;
        }
        let images = this.preview.getElementsByTagName( 'div' );
        this.upper();
        for ( let i = 1; i < images.length; i++ ) {
            images[ i ].style.opacity = 1;
        }
        moveChilds( this, images );
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
    function close( id, idx ) {
        if ( collections[ id ].mouseIsOver === -1 ) {
            if ( collections[ idx ].visible ) {
                collections[ idx ].close( true );
            }
            collections[ id ].hover();
        }
    }
    let delay = 0;
    let i = undefined;
    for ( i = 0; i < collections.length; i++ ) {
        if ( id != i ) {
            if ( collections[ i ].visible ) {
                delay = collections[ i ].close();
                if ( delay > 0 ) {
                    break;
                }
            }
        }
    }
    if ( delay >  0 ) {
        closeTimer.timeout = setTimeout( close, delay, id, i );
        closeTimer.id = i;
    }
    else {
        collections[ id ].hover();
    }
}

function hideAllImages( expect ) {
    for ( let i = 0; i < collections.length; i++ ) {
        if ( collections[ i ].visible ) {
            collections[ i ].close( true );
        }
        collections[ i ].lower();
    }
}

function imgLeave( id, timeout ) {
    function leave() {
        let diff = collections[ id ].mouseIsOver - Date.now();
        if ( collections[ id ].mouseIsOver >= 0 && diff < 0 ) {
            if ( collections[ id ].visible ) {
                let images = collections[ id ].close( true );
            }
        }
        else if ( diff >= 0 ) {
            imgLeave( id, diff );
        }
        else {
            imgLeave( id );
        }
    }
    if ( !timeout ) {
        timeout = 1000;
    }
    setTimeout( leave, timeout );
}

function mouseLeft( id ) {
    collections[ id ].mouseIsOver = Date.now() + 1000;
}

function mouseIsOver( id ) {
    if ( id === closeTimer.id ) {
        clearTimeout( closeTimer.timeout );
    }
    collections[ id ].mouseIsOver = -1;
}

function idle() {
    function isNotIdle() {
        clearTimeout( time  );
        time = setTimeout( hideAllImages, 3000 );
    }
    let time = undefined;
    document.onmousemove = isNotIdle;
    document.onkeypress  = isNotIdle;
}

function moveElement( elem, top, right, bottom, left ) {
    let diffTop  = top - bottom;
    let diffLeft = left - right;
    elem.style.top = diffTop + 'px';
    elem.style.left = (left - right) + 'px';
    return true;
}

function inPage( elem, top, right, bottom, left ) {
    let borders  = elem.getBoundingClientRect();
    let diffTop  = top - bottom;
    let diffLeft = left - right;
    let expr = diffTop*(-1) < borders.top + window.scrollY && diffLeft * (-1) < borders.left + window.scrollX;
    return expr;
}
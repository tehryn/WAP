/**
 * Author: Jiri Matejka (xmatej52)
 */

/* jshint esversion: 6 */
/* jshint node: true */
/* jshint browser: true */
/* jshint -W080 */
// "use strict";

// All collections
var collections = Array();

// Modal settings
var modal       = undefined;
var modalClose  = undefined;
var modalImg    = undefined;
var modalAlt    = undefined;

// Hover timer
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
                fullSize.src = hrefs[ i ].href;
                this.images.push( new Img( divImg, fullSize ) );
                this.images[ i ].preview.setAttribute( 'onmouseover', 'mouseIsOver(' + this.id + ');' );
                this.images[ i ].preview.setAttribute( 'onmouseout', 'mouseLeft(' + this.id + ');' );
            }
        }
        this.width  = 0;
        this.height = 0;
    }

    /**
     * Gets number of images in collection
     * @return {Integer} number of images in collection
     */
    get size() {
        return this.images.length;
    }

    /**
     * Gets imgWrapper of collection
     * @return {Element} Div, where images are stored
     */
    get preview() {
        return document.getElementById( 'collection_' + this.id );
    }

    /**
     * Appends imgWrapper to specific element
     * @param  {Element} root Element where imgWrapper will be appended
     */
    appendWrapper( root ) {
        let div = document.getElementById( 'collection_' + this.id );
        // test if wrapper already exists
        if ( !div ) {
            // span with number of images in wrapper
            let span = document.createElement( 'span' );
            span.innerHTML = this.size;

            // wrapper itself
            div      = document.createElement( 'div' );
            div.id = 'collection_' + this.id;
            div.setAttribute( 'class', 'imgWrapper' );
            div.setAttribute( 'onmouseover', 'mouseIsOver(' + this.id + ');' );
            div.setAttribute( 'onmouseout', 'mouseLeft(' + this.id + ');' );

            // appends images to wrapper
            for ( let i = 0; i < this.size; i++ ) {
                this.images[ i ].preview.style.opacity = 0;
                this.images[ i ].preview.style.zIndex  = 1;
                div.appendChild( this.images[i].preview );
            }

            // apends wrapper to element
            root.appendChild( div );

            // setup preview
            this.images[ 0 ].preview.appendChild( span );
            this.images[ 0 ].preview.style.zIndex  = 2;
            this.images[ 0 ].preview.style.opacity = 1;
            this.images[ 0 ].preview.setAttribute( 'onmouseover', 'imgHover(' + this.id + ');' );
            this.images[ 0 ].preview.setAttribute( 'onmouseout', 'imgLeave(' + this.id + ');' );
        }
    }

    /**
     * Hide all images previews expect first or returns recomended timeout for closing.
     * @param  {Boolean} force close
     * @return {Integer}       Recommended timeout for closing. 0 if images are not visible
     */
    close( force ) {
        if ( this.visible && !force ) {
            return 500;
        }

        if ( this.visible ) {
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
            }
            moveElement( images[ 0 ], 0, 0, 0, 0 );
            this.lower();
        }
        return 0;
    }

    /**
     * Sets z-index of ImgWrapper to 0
     */
    lower() {
        this.preview.style.zIndex = 0;
    }

    /**
     * Sets z-index of ImgWrapper to 3
     */
    upper() {
        this.preview.style.zIndex = 3;
    }

    /**
     * Shows all images of collection
     */
    hover() {
        /**
         * Move images to their position
         * @param  {ImgCollection} collection Object representing collection of images
         * @param  {Array}         images     Images that will be showned
         */
        function moveChilds( collection, images ) {
            /**
             * Move elements as polygon
             */
            function polygon() {
                let bottom = hspace + ( collection.height + spacing * ( steps - 1 )  ) * steps;
                let right  = vspace - spacing;
                // images to top
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    right -= collection.width + spacing;
                }

                // images to right
                bottom = hspace - spacing;
                right  = -( vspace + ( collection.width + spacing * ( steps + 1 ) ) * steps );
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    bottom -= collection.height + spacing;
                }


                // images to bottom
                bottom = -( hspace + ( collection.height + spacing * ( steps + 1 )  ) * steps );
                right  = vspace - spacing;
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    right -= collection.width + spacing;
                }

                // images to left
                bottom = hspace - 5;
                right  = vspace + ( collection.width + spacing * ( steps - 1 ) ) * steps;
                for ( let i = 0; i < y && idx < images.length; i++ ) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    bottom -= collection.height + spacing;
                }

                // images into corners
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
            /**
             * Move images into table
             * @param  {Integer} count index of iteration
             */
            function table( count ) {
                let bottom = count * ( spacing + collection.height );
                let right  = count * ( spacing + collection.width );
                let n      = count * 2 + 1;

                // Moves images to top
                for (let i = 0; idx < images.length && i < n; i++) {
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                    right -= spacing + collection.width;
                }

                // Moves images to right
                right += spacing + collection.width;
                for ( let i = 1; idx < images.length && i < n; i++ ) {
                    bottom -= collection.height + spacing;
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                }

                // Moves images to top bottom
                for (let i = 1; idx < images.length && i < n; i++) {
                    right += spacing + collection.width;
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                }

                // Moves images to left
                for ( let i = 2; idx < images.length && i < n; i++ ) {
                    bottom += collection.height + spacing;
                    if ( inPage( images[ idx ], 0, right, bottom, 0 ) ) {
                        moveElement( images[ idx++ ], 0, right, bottom, 0 );
                    }
                }

                // if not all images are showned, we need to do next iteration
                if ( idx < images.length ) {
                    table( count + 1 );
                }
            }

            // number of images around center
            let x      = images.length - 1;

            // number of images around center without corners
            let circle = x % 4 == 0 ? x - 4 : x - x % 4;
            if ( circle < 4 ) {
                circle = 4;
            }

            // number of images on each side
            let y      = circle / 4;

            // space between center image and rest (not in pixels)
            let space  = ( y - 1 ) / 2;

            // space between images
            let spacing = 5;

            // height of space between rest of images (in pixels)
            let hspace = ( collection.height + spacing ) * space;

            //  width between rest of images (in pixels)
            let vspace = ( collection.width + spacing ) * space;

            // idx of current image
            let idx = 1;

            // Does images fits in document?
            if ( inPage( images[ 0 ], 0, vspace + collection.width, hspace + collection.height, 0 ) ) {
                polygon();
                // resize first image
                images[ 0 ].style.position = 'relative';
                images[ 0 ].style.width  = collection.width + 2*vspace + 'px';
                images[ 0 ].style.height = collection.height + 2*hspace + 'px';
                moveElement( images[ 0 ], 0, vspace -spacing , hspace - spacing, 0 );
            }
            else {
                table(1);
            }
        }

        // test if collection is visible
        if ( this.visible ) {
            return;
        }
        this.visible = true;

        // set width and height if not set yet
        if ( this.width == 0 || this.height == 0 ) {
            this.width  = this.images[ 0 ].preview.offsetWidth;
            this.height = this.images[ 0 ].preview.offsetHeight;
        }

        // gets all images of collection
        let images = this.preview.getElementsByTagName( 'div' );

        // sets z-index
        this.upper();

        // sets visibility
        for ( let i = 1; i < images.length; i++ ) {
            images[ i ].style.opacity = 1;
        }

        // move images to their positions
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

/**
 * Removes all childrens of element
 * @param  {Element} elem Element that will be changed
 */
function removeChilds( elem ) {
    while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
    }
}

/**
 * Starts the module
 */
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
            collections.push( collection );
        }
    });
}

/**
 * Adds modal to page
 */
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

/**
 * Hover on image
 * @param  {Integer} id Index of collection
 */
function imgHover( id ) {
    /**
     * Force closes the collection and open new one if mouse is on it
     * @param  {[type]} id  Id of currently hovered collection
     * @param  {[type]} idx Index of collection that shall be closed
     */
    function close( id, idx ) {
        if ( collections[ id ].mouseIsOver === -1 ) {
            if ( collections[ idx ].visible ) {
                collections[ idx ].close( true );
            }
            collections[ id ].hover();
        }
    }
    // delay of closing
    let delay = 0;
    let i = undefined;

    // closes open collection
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

    // if delay was returned, setup timeout and then close it
    // otherwise open hovered collection
    if ( delay >  0 ) {
        closeTimer.timeout = setTimeout( close, delay, id, i );
        closeTimer.id = i;
    }
    else {
        collections[ id ].hover();
    }
}

/**
 * Closes all collections
 */
function hideAllImages() {
    for ( let i = 0; i < collections.length; i++ ) {
        if ( collections[ i ].visible ) {
            collections[ i ].close( true );
        }
        collections[ i ].lower();
    }
}

/**
 * Leaving hovered collection - set timeout and close it
 * @param  {Integer} id      Index of collection
 * @param  {Integer} timeout How long shall we wait, default value is 1000 ms
 */
function imgLeave( id, timeout ) {
    /**
     * Closes collection if timeout expired
     */
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

/**
 * Mouse left the content of collection
 * @param  {Integer} id Index of collection
 */
function mouseLeft( id ) {
    collections[ id ].mouseIsOver = Date.now() + 1000;
}

/**
 * Mouse hovered content of collection
 * @param  {Integer} id Index of collection
 */
function mouseIsOver( id ) {
    if ( id === closeTimer.id ) {
        clearTimeout( closeTimer.timeout );
    }
    collections[ id ].mouseIsOver = -1;
}

/**
 * Measure if user is idle or active. Closes open collection if user is idle.
 */
function idle() {
    /**
     * Resets the timeout
     */
    function isNotIdle() {
        clearTimeout( time  );
        time = setTimeout( hideAllImages, 3000 );
    }
    let time = undefined;
    document.onmousemove = isNotIdle;
    document.onkeypress  = isNotIdle;
}

/**
 * Moves element to specific position
 * @param  {Element} elem   Element that shall be moved
 * @param  {Integer} top     Distance from top
 * @param  {Integer} right   Distance from right
 * @param  {Integer} bottom  Distance from bottom
 * @param  {Integer} left    Distance from left
 */
function moveElement( elem, top, right, bottom, left ) {
    let diffTop  = top - bottom;
    let diffLeft = left - right;
    elem.style.top = diffTop + 'px';
    elem.style.left = (left - right) + 'px';
}

/**
 * Test if element is in document content.
 * @param  {Element} elem   Element that shall be testet
 * @param  {Integer} top     Distance from top
 * @param  {Integer} right   Distance from right
 * @param  {Integer} bottom  Distance from bottom
 * @param  {Integer} left    Distance from left
 * @return {Boolean}         True if element is in document, otherwise false
 */
function inPage( elem, top, right, bottom, left ) {
    let borders  = elem.getBoundingClientRect();
    let diffTop  = top - bottom;
    let diffLeft = left - right;
    let expr = diffTop*(-1) < borders.top + window.scrollY && diffLeft * (-1) < borders.left + window.scrollX;
    return expr;
}
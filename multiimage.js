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
        this.mouseIsOver = false;
        this.id = idx;
        for ( let i = 0; i < hrefs.length; i++) {
            let images = elem.getElementsByTagName( 'img' );
            if ( images.length > 0 ) {
                let fullSize = document.createElement( 'img' );
                fullSize.src = hrefs[ i ].href;
                this.images.push( new Img( images[i], fullSize ) );
                this.images[ i ].preview.setAttribute( 'onmouseover', 'mouseIsOver(' + this.id + ');' );
                this.images[ i ].preview.setAttribute( 'onmouseout', 'mouseLeft(' + this.id + ');' );
            }
        }
    }

    get size() {
        return this.images.length;
    }

    get preview() {
        let div = document.getElementById( 'collection_' + this.id );
        if ( div ) {
            return div;
        }
        else {
            div = document.createElement( 'div' );
            div.id = 'collection_' + this.id;
            for ( let i = 0; i < this.size; i++ ) {
                this.images[ i ].preview.style.display = 'none';
                div.appendChild( this.images[i].preview );
            }
            this.images[ 0 ].preview.style.display = 'block';
            this.images[ 0 ].preview.setAttribute( 'onmouseover', 'imgHover(' + this.id + ');' );
            this.images[ 0 ].preview.setAttribute( 'onmouseout', 'imgLeave(' + this.id + ');' );
            return div;
        }
    }

    hover() {
        let images = this.preview.getElementsByTagName( 'img' );
        for ( let i = 0; i < images.length; i++ ) {
            images[ i ].style.display = 'block';
        }
    }

}

class Img {
    constructor ( preview, fullSize) {
        this.fullSize = fullSize;
        this.preview  = preview;
        this.preview.setAttribute( 'class', 'imgPreview' );
        this.preview.onclick = function() {
            modal.style.display = 'block';
            modalImg.src        = this.src;
            modalAlt.innerHTML  = this.alt;
        };
    }
}

function removeChilds( elem ) {
    while (elem.firstChild) {
        elem.removeChild( elem.firstChild );
    }
}

function multiimage() {
    addModal();
    let elements = document.getElementsByClassName( 'multiimage' );
    for ( let i = 0; i < elements.length; i++) {
        let collection = new ImgCollection( elements[i], i );
        if ( collection.size < 1 ) {
            continue;
        }
        removeChilds( elements[ i ] );
        elements[ i ].appendChild( collection.preview );
        //let plus = document.createElement( 'span' );
        //plus.innerHTML = '&plus;';
        //plus.setAttribute( 'class', 'previewMark' );
        //elements[ i ].appendChild( plus );
        collections.push( collection );
    }
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
    console.log( 'hover ' + id );
    collections[ id ].hover();
}

function imgLeave( id ) {
    function leave() {
        let images = collections[ id ].preview.getElementsByTagName( 'img' );
        if ( !collections[ id ].mouseIsOver ) {
            for ( let i = 1; i < images.length; i++ ) {
                images[ i ].style.display = 'none';
            }
        }
        else {
            imgLeave( id );
        }
    }

    setTimeout( leave, 1000 );
    //collections[ id ].leave()
}

function mouseLeft( id ) {
    collections[ id ].mouseIsOver = false;
}

function mouseIsOver( id ) {
    collections[ id ].mouseIsOver = true;
}

// src/ar/ARButton.js
import * as THREE from 'three';

function ARButton( renderer ) {

    const button = document.createElement( 'button' );
    button.id = 'ARButton';
    // Style the button
    button.style.cssText = 'width: 100%; height: 50px; background: #0088AA; border: none; color: white; font-size: 16px; cursor: pointer;';
    button.textContent = 'START AR';

    const showARNotSupported = () => {
        button.textContent = 'AR NOT SUPPORTED';
        button.disabled = true;
        button.style.backgroundColor = 'red';
    };

    if ( 'xr' in navigator ) {

        navigator.xr.isSessionSupported( 'immersive-ar' ).then( ( supported ) => {

            if ( supported ) {

                button.addEventListener( 'click', () => {
                    
                    // Request the AR session when the button is clicked
                    navigator.xr.requestSession( 'immersive-ar', { 
                        // Request camera and surface tracking features
                        requiredFeatures: ['local-floor', 'hit-test'],
                        // Include dom-overlay for possible future UI
                        optionalFeatures: ['dom-overlay'],
                        domOverlay: { root: document.body }
                    } )
                    .then( ( session ) => {
                        // Success: Set the session and change button text
                        renderer.xr.setSession( session );
                        button.textContent = 'STOP AR'; 
                    } )
                    .catch( ( error ) => {
                        // CRITICAL: Alert on failure to diagnose silent blocks
                        console.error('AR Session Request Failed:', error);
                        // The alert will tell us the exact DOMException name (e.g., NotAllowedError, SecurityError)
                        alert(`AR FAILED! Error: ${error.name}. Check console.`); 
                        showARNotSupported();
                    });

                } );

            } else {

                showARNotSupported();

            }

        } );

    } else {

        // Fallback for browsers without WebXR API
        showARNotSupported();

    }
    
    // Handle the button state when session ends 
    renderer.xr.addEventListener( 'sessionend', () => {
        button.textContent = 'START AR';
    } );

    return button;
}

export { ARButton };
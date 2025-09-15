import { SpeechSynthesizer } from "@prismlabs/web-scan-core";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  PRISM_BUTTON_CLASS,
  PRISM_CSS_CLASSNAME,
  PRISM_SESSION_VIEW,
} from "../../constants";
import { dispatchStateChange } from "../../dispatch";
import { PrismSessionView } from "../prism-session-view/PrismSessionView";

export function findAndRenderPrismButton() {
  // Find all elements with the prism-button class
  const prismElements = document.getElementsByClassName(PRISM_BUTTON_CLASS);

  // Convert HTMLCollection to Array for easier manipulation
  const elements = Array.from(prismElements);

  if (elements.length === 0) {
    console.log("No Prism button elements found on the page");
    return;
  }

  console.log(`Found ${elements.length} Prism button elements`);

  // Initialize each button
  elements.forEach((element) => {
    if (element instanceof HTMLElement) {
      // Create and append the Prism button
      createPrismButton(element);
    }
  });
}

// Injects the overscroll-behavior style if not already present
function injectPrismModalStyle() {
  if (document.getElementById("prism-modal-style")) return;
  const style = document.createElement("style");
  style.id = "prism-modal-style";
  style.textContent = `
    .prism-modal-open, .prism-modal-open body {
      overscroll-behavior: none !important;
    }
  `;
  document.head.appendChild(style);
}

function prismButtonHandler() {
  // Inject overscroll prevention style and add class
  injectPrismModalStyle();
  document.documentElement.classList.add("prism-modal-open");
  // In order to get the Speech Synthesizer to work properly, we need to ensure
  // that the user has interacted with the page first. This is a requirement
  const speech = new SpeechSynthesizer();
  speech.speak(""); // Speak an empty string to initialize the SpeechSynthesizer

  // If a modal is already open, do nothing
  if (document.getElementById(PRISM_SESSION_VIEW)) {
    return;
  }

  // Create a container for the modal if it doesn't exist
  let modalContainer = document.getElementById(PRISM_SESSION_VIEW);
  if (!modalContainer) {
    modalContainer = document.createElement("div");
    modalContainer.className = PRISM_CSS_CLASSNAME;
    modalContainer.id = PRISM_SESSION_VIEW;
    document.body.appendChild(modalContainer);
  }

  // Create root and render the modal
  const root = createRoot(modalContainer);
  root.render(
    React.createElement(PrismSessionView, {
      onSessionStateChange: dispatchStateChange,
      onClose: () => {
        root.unmount();
        // Remove overscroll prevention class
        document.documentElement.classList.remove("prism-modal-open");
        // Remove the modal container from the DOM when closed
        if (modalContainer && modalContainer.parentNode) {
          modalContainer.parentNode.removeChild(modalContainer);
        }
      },
    })
  );
}

function createPrismButton(button: HTMLElement): void {
  // remove previous click handler, if still present
  button.removeEventListener("click", prismButtonHandler);
  // Add click handler
  button.addEventListener("click", prismButtonHandler);
}

// Programmatic entry to present the Prism modal using the same flow as the button click.
export function presentPrismModal() {
  prismButtonHandler();
}

export var PRISM_CSS_CLASSNAME = 'prism-css';
export var PRISM_BUTTON_CLASS = 'prism-button';
export var PRISM_SESSION_VIEW = 'prism-session-view';
/* ENV Keys Types */
export var DeploymentType;
(function (DeploymentType) {
    DeploymentType["CDN"] = "cdn";
    DeploymentType["PACKAGE"] = "package";
    DeploymentType["LOCAL"] = "local";
})(DeploymentType || (DeploymentType = {}));

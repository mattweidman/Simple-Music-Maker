// starting point for application-specific code.

import { Staff } from "./staff";
import { Toolbar } from "./toolbar";

// create the staff
var staff: Staff = new Staff();
staff.display();

// create the toolbar
var toolbar: Toolbar = new Toolbar(staff);
toolbar.display();

// window resize event
window.onresize = () => {
    staff.display();
}
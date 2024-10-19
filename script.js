document.getElementById("calculate-btn").addEventListener("click", function () {
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    
    if (!height || !weight) {
        alert("Please enter both height and weight.");
        return;
    }

    // Convert height to meters
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    // Update the BMI value on the screen
    document.getElementById("bmi-value").innerText = bmi;

    // Define BMI categories and their corresponding needle angles and colors
    let category = ''; // Underweight , Normal, Overweight
    let targetRotation = 0;  // Angle of needle movement
    let gaugeColor = '';

    if (bmi < 18.5) {
        category = "Underweight";
        targetRotation = (bmi / 18.5) * 45;  // Scale for underweight (0-45 degrees)
        gaugeColor = "#76c7c0";  // Light Blue
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Normal";
        targetRotation = 90;  // Normal range fixed to 90 degrees
        gaugeColor = "#ffff00";  // Yellow
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = "Overweight (Thick)";
        targetRotation = 45;  // Overweight fixed to 45 degrees
        gaugeColor = "#4caf50";  // Green
    } else if (bmi >= 30 && bmi <= 40) {
        category = "Obesity";
        targetRotation = 270;  // Obesity fixed to 170 degrees
        gaugeColor = "#ff0000";  // Red
    } else {
        category = "Severe Obesity";
        targetRotation = 270; // Beyond Obesity category, remains max at 170 degrees
        gaugeColor = "#ff0000";  // Red
    }

    // Update the category on the screen
    document.getElementById("category").innerText = category;

    // Smoothly move the needle to the target position
    const needle = document.getElementById("needle");
    animateNeedle(needle, targetRotation);

    // Update the gauge fill color based on BMI category
    const gaugeFill = document.getElementById("gauge-fill");
    gaugeFill.style.stroke = gaugeColor;  // Apply stroke color to the gauge fill
});

/**
 * Smoothly animates the needle from the current position to the target rotation
 * @param {HTMLElement} needle - The needle element
 * @param {number} targetRotation - The target rotation in degrees (45, 90, 170, etc.)
 */
// targetRotation: This is the target angle in degrees where the needle should move based on the BMI value (e.g., 45, 90, 170 degrees).
function animateNeedle(needle, targetRotation) {
    const currentRotation = getNeedleRotation(needle);
    const step = (targetRotation - currentRotation) / 100; // Smooth movement with 100 steps
    /*
    This line calculates the size of the increment (or step) by dividing the difference between the targetRotation and currentRotation by 100. The division by 100 ensures that the movement happens in 100 small steps, which gives a smooth and gradual transition of the needle instead of jumping to the final position immediately.
    */
    let progress = 0;
    // A progress variable is initialized to 0. This will keep track of how many steps the animation has gone through and how far the needle has rotated. It is incremented in each frame of the animation.

    function moveNeedle() {
        // This if condition checks whether the animation is complete. 
        //Since we defined 100 steps earlier, this condition ensures the needle keeps moving until progress reaches 100.
        if (progress < 100) {
            progress++;
            const newRotation = currentRotation + step * progress;
            // Here, newRotation is calculated by adding the progress made so far (step * progress) to the currentRotation. This ensures that the needle moves a little bit more with each step. Since step is a fraction of the total movement, this results in smooth animation.
            needle.style.transform = `rotate(${newRotation}deg)`;
            requestAnimationFrame(moveNeedle); // Continue animation frame by frame
        }
    }

    requestAnimationFrame(moveNeedle); // Start the animation
}
/*
Summary of the Process:

	1.	Initialize: We get the current rotation of the needle and calculate the step size based on the difference between the current and target rotation.
	2.	Animate: In each animation frame, the needle’s rotation is increased by the calculated step size.
	3.	Check Progress: If the needle has not reached the target, we increment progress and move the needle a bit more.
	4.	Repeat: The function keeps being called in each animation frame using requestAnimationFrame until the needle reaches the target rotation.
*/
/**
 * Extracts the current rotation of the needle from its transform property
 * @param {HTMLElement} needle - The needle element
 * @returns {number} - The current rotation in degrees
 */
function getNeedleRotation(needle) {
    const transform = window.getComputedStyle(needle).getPropertyValue('transform');
    /*
    Here, we use the window.getComputedStyle method to obtain the computed styles 
    of the needle element. We specifically retrieve the transform property, 
    which contains the transformation applied to the element (including rotation). 
    The result is stored in the variable transform.
    */
   /*
   This if statement checks whether the transform property is not equal to 'none'. 
   If the needle has not been transformed (i.e., it has no rotation applied), 
   we skip the rotation calculations.
    If it has a transformation, we proceed to extract the rotation values.
   */
    if (transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        /*
        In this line, we extract the values of the transformation matrix:

	•	transform.split('(')[1] splits the string at the opening parenthesis ( and retrieves the second part, which contains the matrix values.
	•	.split(')')[0] further splits this string at the closing parenthesis ) to isolate the matrix part.
	•	Finally, .split(',') splits this string by commas to create an array of numerical values representing the transformation components.
     These values correspond to the matrix’s a, b, c, d, e, and f values in the matrix representation.
        */
        const a = values[0];
        const b = values[1];
        const radians = Math.atan2(b, a);
        const degrees = radians * (180 / Math.PI);

        return degrees < 0 ? degrees + 360 : degrees;
    }
    return 0; // Default rotation is 0 degrees
}
/*
Summary of the Function:

	•	The getNeedleRotation function extracts the current rotation angle of a needle (or any element) in degrees.
	•	It checks if any transformation is applied and calculates the rotation angle based on the transformation matrix.
	•	The resulting angle is returned, or 0 is returned if no transformation exists. This allows other functions to 
    understand the needle’s current position for animations or further calculations.
*/
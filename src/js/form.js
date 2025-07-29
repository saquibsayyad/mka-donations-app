// This file contains functions related to form handling, including validation of user input and managing the state of the form as the user progresses through the steps.

let currentStep = 1;

function showStep(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((s) => {
        s.style.display = 'none';
    });
    document.getElementById(`step${step}`).style.display = 'block';
}

function nextStep() {
    if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
    }
}

function validateStep(step) {
    let isValid = true;
    const inputs = document.querySelectorAll(`#step${step} input, #step${step} select`);
    inputs.forEach((input) => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    return isValid;
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

function getFormData() {
    const formData = {};
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach((input) => {
        formData[input.name] = input.value;
    });
    return formData;
}

document.addEventListener('DOMContentLoaded', () => {
    showStep(currentStep);
    document.querySelectorAll('.next-button').forEach((button) => {
        button.addEventListener('click', nextStep);
    });
    document.querySelectorAll('.prev-button').forEach((button) => {
        button.addEventListener('click', previousStep);
    });
});
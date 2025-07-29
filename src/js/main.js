document.addEventListener('DOMContentLoaded', function() {
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-button');
    const backButtons = document.querySelectorAll('.back-button');
    const summaryButton = document.getElementById('pay-button');

    function showStep(step) {
        steps.forEach((s, index) => {
            s.style.display = index === step ? 'block' : 'none';
        });
    }

    function setInvalid(id, message) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('is-invalid');
        const feedback = el.parentElement.querySelector('.invalid-feedback');
        if (feedback) feedback.textContent = message;
    }
    function clearInvalid(id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove('is-invalid');
    }

    function validateStep(step) {
        let valid = true;

        if (step === 0) {
            // Name
            const name = document.getElementById('name').value.trim();
            if (!name) {
                setInvalid('name', 'Please enter your name.');
                valid = false;
            } else {
                clearInvalid('name');
            }

            // Email
            const email = document.getElementById('email').value.trim();
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                setInvalid('email', 'Please enter a valid email address.');
                valid = false;
            } else {
                clearInvalid('email');
            }

            // Majlis
            const majlis = document.getElementById('majlis').value;
            if (!majlis) {
                setInvalid('majlis', 'Please select your Majlis.');
                valid = false;
            } else {
                clearInvalid('majlis');
            }

            // AIMS ID or No AIMS
            const aimsId = document.getElementById('aimsId').value.trim();
            const noAims = document.getElementById('noAims').checked;
            if (!aimsId && !noAims) {
                setInvalid('aimsId', 'Please enter your AIMS ID or select the option below.');
                valid = false;
            } else {
                clearInvalid('aimsId');
            }

            // Group
            const group = document.querySelector('input[name="group"]:checked');
            const groupRadios = document.querySelectorAll('input[name="group"]');
            if (!group) {
                groupRadios.forEach(radio => radio.classList.add('is-invalid'));
                valid = false;
            } else {
                groupRadios.forEach(radio => radio.classList.remove('is-invalid'));
            }

            return valid;
        }

        if (step === 1) {
            // Chanda fields validation
            const group = document.querySelector('input[name="group"]:checked');
            // Clear previous errors
            ['chanda-khuddam', 'chanda-ijtema', 'future-fund', 'chanda-atfal', 'chanda-ijtema-atfal'].forEach(id => clearInvalid(id));

            if (group && group.value === "Khuddam") {
                const khuddam = document.getElementById('chanda-khuddam').value;
                const ijtema = document.getElementById('chanda-ijtema').value;
                const futureFund = document.getElementById('future-fund').value;
                if ((!khuddam || khuddam.trim() === "") && (!ijtema || ijtema.trim() === "") && (!futureFund || futureFund.trim() === "")) {
                    setInvalid('chanda-khuddam', 'Please enter at least one Chanda amount.');
                    setInvalid('chanda-ijtema', 'Please enter at least one Chanda amount.');
                    setInvalid('future-fund', 'Please enter at least one Chanda amount.');
                    valid = false;
                }
                if ([khuddam, ijtema, futureFund].some(val => val && parseFloat(val) < 0)) {
                    if (khuddam && parseFloat(khuddam) < 0) setInvalid('chanda-khuddam', 'Chanda cannot be negative.');
                    if (ijtema && parseFloat(ijtema) < 0) setInvalid('chanda-ijtema', 'Chanda cannot be negative.');
                    if (futureFund && parseFloat(futureFund) < 0) setInvalid('future-fund', 'Chanda cannot be negative.');
                    valid = false;
                }
            } else if (group && group.value === "Atfal") {
                const atfal = document.getElementById('chanda-atfal').value;
                const ijtemaAtfal = document.getElementById('chanda-ijtema-atfal').value;
                if ((!atfal || atfal.trim() === "") && (!ijtemaAtfal || ijtemaAtfal.trim() === "")) {
                    setInvalid('chanda-atfal', 'Please enter at least one Chanda amount.');
                    setInvalid('chanda-ijtema-atfal', 'Please enter at least one Chanda amount.');
                    valid = false;
                }
                if ([atfal, ijtemaAtfal].some(val => val && parseFloat(val) < 0)) {
                    if (atfal && parseFloat(atfal) < 0) setInvalid('chanda-atfal', 'Chanda cannot be negative.');
                    if (ijtemaAtfal && parseFloat(ijtemaAtfal) < 0) setInvalid('chanda-ijtema-atfal', 'Chanda cannot be negative.');
                    valid = false;
                }
            } else {
                // Should not happen, but fallback
                valid = false;
            }
            return valid;
        }

        // Only return true if a known step was validated
        return false;
    }

    function updateSummary() {
        // Logic to gather data from the form and update the summary
        const userDetails = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            majlis: document.getElementById('majlis').value,
            aimsId: document.getElementById('aimsId').value || (document.getElementById('noAims').checked ? 'N/A' : ''),
            group: document.querySelector('input[name="group"]:checked')?.value || '',
        };

        const chandaBreakdown = {
            khuddam: document.getElementById('chanda-khuddam').value,
            ijtema: document.getElementById('chanda-ijtema').value,
            futureFund: document.getElementById('future-fund').value,
            atfal: document.getElementById('chanda-atfal').value,
            ijtemaAtfal: document.getElementById('chanda-ijtema-atfal').value,
        };

        // Calculate total amount
        const totalAmount = Object.values(chandaBreakdown).reduce((acc, val) => acc + parseFloat(val || 0), 0);

        // Fill user info as before
        document.getElementById('summary-name').innerText = userDetails.name;
        document.getElementById('summary-email').innerText = userDetails.email;
        document.getElementById('summary-majlis').innerText = userDetails.majlis;
        document.getElementById('summary-aimsid').innerText = userDetails.aimsId;
        document.getElementById('summary-group').innerText = userDetails.group;

        // Fill chanda breakdown table
        const chandaTable = document.getElementById('summary-chanda-table');
        chandaTable.innerHTML = '';
        let total = 0;
        Object.entries(chandaBreakdown).forEach(([type, value]) => {
            if (value && parseFloat(value) > 0) {
                total += parseFloat(value);
                const label = type
                    .replace('khuddam', 'Khuddam')
                    .replace('ijtema', 'Ijtema')
                    .replace('futureFund', 'Future Fund')
                    .replace('atfal', 'Atfal')
                    .replace('ijtemaAtfal', 'Ijtema');
                chandaTable.innerHTML += `
                    <tr>
                        <td>${label.replace(/chanda-?/i, 'Chanda ')}</td>
                        <td class="text-end">€${parseFloat(value).toFixed(2)}</td>
                    </tr>
                `;
            }
        });
        document.getElementById('summary-total').innerText = total.toFixed(2);
    }

    function updateChandaFields() {
        const group = document.querySelector('input[name="group"]:checked');
        if (group) {
            if (group.value === "Khuddam") {
                document.getElementById('khuddam-fields').style.display = 'block';
                document.getElementById('atfal-fields').style.display = 'none';
            } else {
                document.getElementById('khuddam-fields').style.display = 'none';
                document.getElementById('atfal-fields').style.display = 'block';
            }
        }
    }

    nextButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                    // Show correct fields when entering Step 2
                    if (currentStep === 1) {
                        updateChandaFields();
                    }
                    if (currentStep === steps.length - 1) {
                        updateSummary();
                    }
                }
            }
        });
    });

    backButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    if (summaryButton) {
        summaryButton.addEventListener('click', function() {
            // Call the function to initiate payment via Mollie API
            initiatePayment();
        });
    }

    document.querySelectorAll('input[name="group"]').forEach(radio => {
        radio.addEventListener('change', updateChandaFields);
    });

    document.getElementById('noAims').addEventListener('change', function() {
        const aimsIdInput = document.getElementById('aimsId');
        if (this.checked) {
            aimsIdInput.value = '';
            aimsIdInput.disabled = true;
            aimsIdInput.classList.remove('is-invalid');
        } else {
            aimsIdInput.disabled = false;
        }
    });

    showStep(currentStep);
});

function initiatePayment() {
    alert('Payment would be initiated here (Mollie integration needed).');
}
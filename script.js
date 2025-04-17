document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authModal = document.getElementById('authModal');
    const loginView = document.getElementById('loginView');
    const mfaView = document.getElementById('mfaView');
    const showMfa = document.getElementById('showMfa');
    const backToLogin = document.getElementById('backToLogin');
    const loginBtn = document.getElementById('loginBtn');
    const verifyMfa = document.getElementById('verifyMfa');
    const securityStatus = document.getElementById('securityStatus');
    const showSessionKey = document.getElementById('showSessionKey');
    const sessionKey = document.getElementById('sessionKey');
    const securityDetails = document.getElementById('securityDetails');
    const securityModal = document.getElementById('securityModal');
    const closeSecurityModal = document.getElementById('closeSecurityModal');
    const answerCall = document.getElementById('answerCall');
    const declineCall = document.getElementById('declineCall');
    const incomingCall = document.getElementById('incomingCall');
    const activeCall = document.getElementById('activeCall');
    const callStatus = document.getElementById('callStatus');
    const callTimer = document.getElementById('callTimer');
    const callMessages = document.getElementById('callMessages');
    const callMessageInput = document.getElementById('callMessageInput');
    const sendMessage = document.getElementById('sendMessage');
    const startVideo = document.getElementById('startVideo');
    const muteMic = document.getElementById('muteMic');
    const shareScreen = document.getElementById('shareScreen');
    const endCall = document.getElementById('endCall');

    // State variables
    let isAuthenticated = false;
    let isCallActive = false;
    let callStartTime = null;
    let timerInterval = null;
    let isSessionKeyVisible = false;
    let isMicMuted = false;
    let isVideoOn = false;
    let isScreenSharing = false;

    // Event Listeners
    showMfa.addEventListener('click', () => {
        loginView.classList.add('hidden');
        mfaView.classList.remove('hidden');
    });

    backToLogin.addEventListener('click', () => {
        mfaView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    loginBtn.addEventListener('click', authenticateUser);
    verifyMfa.addEventListener('click', verifyMfaCode);
    showSessionKey.addEventListener('click', toggleSessionKeyVisibility);
    securityDetails.addEventListener('click', () => securityModal.classList.remove('hidden'));
    closeSecurityModal.addEventListener('click', () => securityModal.classList.add('hidden'));
    answerCall.addEventListener('click', startCall);
    declineCall.addEventListener('click', declineIncomingCall);
    sendMessage.addEventListener('click', sendChatMessage);
    callMessageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendChatMessage();
    });
    muteMic.addEventListener('click', toggleMicrophone);
    startVideo.addEventListener('click', toggleVideo);
    shareScreen.addEventListener('click', toggleScreenShare);
    endCall.addEventListener('click', endCurrentCall);

    // Set current time for security modal
    document.getElementById('connectionTime').textContent = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // Functions
    function authenticateUser() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }
        
        // Simulate authentication
        setTimeout(() => {
            authModal.classList.add('hidden');
            securityStatus.classList.remove('hidden');
            isAuthenticated = true;
            
            // Simulate incoming call after 2 seconds
            setTimeout(() => {
                callStatus.textContent = 'Incoming call...';
            }, 2000);
        }, 1000);
    }

    function verifyMfaCode() {
        // Simulate MFA verification
        setTimeout(() => {
            authModal.classList.add('hidden');
            securityStatus.classList.remove('hidden');
            isAuthenticated = true;
            
            // Simulate incoming call after 2 seconds
            setTimeout(() => {
                callStatus.textContent = 'Incoming call...';
            }, 2000);
        }, 1000);
    }

    function toggleSessionKeyVisibility() {
        isSessionKeyVisible = !isSessionKeyVisible;
        sessionKey.textContent = isSessionKeyVisible ? 'E2E-5A9D82F4-B7C3' : '••••••••••••';
        showSessionKey.innerHTML = isSessionKeyVisible ? 
            '<i class="fas fa-eye-slash mr-1"></i> Hide Session Key' : 
            '<i class="fas fa-eye mr-1"></i> Reveal Session Key';
    }

    function startCall() {
        incomingCall.classList.add('hidden');
        activeCall.classList.remove('hidden');
        callTimer.classList.remove('hidden');
        callStatus.textContent = 'Call in progress';
        isCallActive = true;
        
        // Start call timer
        callStartTime = new Date();
        timerInterval = setInterval(updateCallTimer, 1000);
        
        // Simulate agent response after 3 seconds
        setTimeout(() => {
            addAgentMessage("I'm reviewing your case now. Can you please describe the issue you're experiencing?");
        }, 3000);
    }

    function declineIncomingCall() {
        callStatus.textContent = 'Call declined';
        setTimeout(() => {
            callStatus.textContent = 'Ready to connect';
        }, 2000);
    }

    function endCurrentCall() {
        isCallActive = false;
        clearInterval(timerInterval);
        activeCall.classList.add('hidden');
        incomingCall.classList.remove('hidden');
        callTimer.classList.add('hidden');
        callStatus.textContent = 'Call ended';
        
        // Clear chat messages
        callMessages.innerHTML = '';
        
        // Reset media states
        isMicMuted = false;
        isVideoOn = false;
        isScreenSharing = false;
        updateButtonStates();
        
        // Simulate new call after 5 seconds
        setTimeout(() => {
            callStatus.textContent = 'Ready to connect';
        }, 5000);
    }

    function sendChatMessage() {
        const message = callMessageInput.value.trim();
        if (!message) return;
        
        // Add user message
        const messageElement = document.createElement('div');
        messageElement.className = 'flex items-start mb-4 justify-end';
        messageElement.innerHTML = `
            <div class="ml-3 text-right">
                <div class="bg-blue-600 text-white p-3 rounded-lg shadow-sm max-w-xs inline-block">
                    <p class="text-sm">${message}</p>
                </div>
                <p class="text-xs text-gray-500 mt-1">You • Just now</p>
            </div>
            <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <i class="fas fa-user text-blue-600"></i>
                </div>
            </div>
        `;
        callMessages.appendChild(messageElement);
        callMessageInput.value = '';
        
        // Scroll to bottom
        callMessages.scrollTop = callMessages.scrollHeight;
        
        // Simulate agent response after 1-3 seconds
        setTimeout(() => {
            const responses = [
                "I understand. Let me check our security logs.",
                "Thanks for that information. I'm looking into it now.",
                "That's helpful. I need to verify some details on our end.",
                "I see. Let me escalate this to our security team."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addAgentMessage(randomResponse);
        }, 1000 + Math.random() * 2000);
    }

    function addAgentMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'flex items-start mb-4';
        messageElement.innerHTML = `
            <div class="flex-shrink-0">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <i class="fas fa-user text-blue-600"></i>
                </div>
            </div>
            <div class="ml-3">
                <div class="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                    <p class="text-sm text-gray-800">${message}</p>
                </div>
                <p class="text-xs text-gray-500 mt-1">Agent • Just now</p>
            </div>
        `;
        callMessages.appendChild(messageElement);
        
        // Scroll to bottom
        callMessages.scrollTop = callMessages.scrollHeight;
    }

    function updateCallTimer() {
        const now = new Date();
        const elapsed = new Date(now - callStartTime);
        const hours = String(elapsed.getUTCHours()).padStart(2, '0');
        const minutes = String(elapsed.getUTCMinutes()).padStart(2, '0');
        const seconds = String(elapsed.getUTCSeconds()).padStart(2, '0');
        callTimer.innerHTML = `<i class="fas fa-clock mr-1"></i><span>${hours}:${minutes}:${seconds}</span>`;
    }

    function toggleMicrophone() {
        isMicMuted = !isMicMuted;
        updateButtonStates();
    }

    function toggleVideo() {
        isVideoOn = !isVideoOn;
        updateButtonStates();
    }

    function toggleScreenShare() {
        isScreenSharing = !isScreenSharing;
        updateButtonStates();
    }

    function updateButtonStates() {
        // Update microphone button
        const micIcon = muteMic.querySelector('i');
        if (isMicMuted) {
            muteMic.classList.add('bg-red-100', 'border-red-200');
            muteMic.classList.remove('bg-white', 'border-gray-200');
            micIcon.classList.remove('text-blue-600');
            micIcon.classList.add('text-red-600');
            micIcon.className = 'fas fa-microphone-slash';
            muteMic.querySelector('span').textContent = 'Unmute';
        } else {
            muteMic.classList.remove('bg-red-100', 'border-red-200');
            muteMic.classList.add('bg-white', 'border-gray-200');
            micIcon.classList.add('text-blue-600');
            micIcon.classList.remove('text-red-600');
            micIcon.className = 'fas fa-microphone';
            muteMic.querySelector('span').textContent = 'Mute';
        }
        
        // Update video button
        const videoIcon = startVideo.querySelector('i');
        if (isVideoOn) {
            startVideo.classList.add('bg-green-100', 'border-green-200');
            startVideo.classList.remove('bg-white', 'border-gray-200');
            videoIcon.classList.remove('text-blue-600');
            videoIcon.classList.add('text-green-600');
            startVideo.querySelector('span').textContent = 'Stop Video';
        } else {
            startVideo.classList.remove('bg-green-100', 'border-green-200');
            startVideo.classList.add('bg-white', 'border-gray-200');
            videoIcon.classList.add('text-blue-600');
            videoIcon.classList.remove('text-green-600');
            startVideo.querySelector('span').textContent = 'Video';
        }
        
        // Update screen share button
        const screenIcon = shareScreen.querySelector('i');
        if (isScreenSharing) {
            shareScreen.classList.add('bg-purple-100', 'border-purple-200');
            shareScreen.classList.remove('bg-white', 'border-gray-200');
            screenIcon.classList.remove('text-blue-600');
            screenIcon.classList.add('text-purple-600');
            shareScreen.querySelector('span').textContent = 'Stop Share';
        } else {
            shareScreen.classList.remove('bg-purple-100', 'border-purple-200');
            shareScreen.classList.add('bg-white', 'border-gray-200');
            screenIcon.classList.add('text-blue-600');
            screenIcon.classList.remove('text-purple-600');
            shareScreen.querySelector('span').textContent = 'Share';
        }
    }

    // Initialize
    updateButtonStates();
});
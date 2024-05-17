document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');

    // Drag and drop functionality
    draggables.forEach(draggable => {
        draggable.addEventListener('mousedown', onMouseDown);

        function onMouseDown(e) {
            e.preventDefault();

            let shiftX = e.clientX - draggable.getBoundingClientRect().left;
            let shiftY = e.clientY - draggable.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            function onMouseMove(e) {
                moveAt(e.clientX, e.clientY);
            }

            function moveAt(clientX, clientY) {
                draggable.style.left = clientX - shiftX + 'px';
                draggable.style.top = clientY - shiftY + 'px';
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                checkDrop(draggable);
            }
        }

        draggable.ondragstart = () => false;
    });

    // Function to show messages
    function showMessage(messageText) {
        const messageContainer = document.getElementById('message-container');
        const message = document.createElement('div');
        message.classList.add('message-bubble');
        message.textContent = messageText;
        messageContainer.appendChild(message);

        // Automatically remove the message after a certain time
        setTimeout(() => {
            message.remove();
        }, 5000);
    }

    // Function to show congratulatory messages
    function showCongratulatoryMessage(itemName) {
        const messageContainer = document.getElementById('message-container');
        const message = document.createElement('div');
        message.classList.add('message-bubble');
        message.textContent = `Yay! Je hebt de ${itemName} correct geplaatst.`;

        // Add sustainability tip based on the placed item
        switch (itemName) {
            case 'Snijplank':
                message.textContent += " Gebruik een houten snijplank in plaats van plastic. Dit vermindert plastic afval en bevordert duurzaamheid.";
                break;
            case 'Waterbeker':
                message.textContent += " Kies voor een herbruikbare waterfles om plastic afval te verminderen en duurzaamheid te bevorderen.";
                break;
            case 'Zout en peper shaker':
                message.textContent += " Kies voor navulbare zout- en peperstrooiers om afval te verminderen en hergebruik te stimuleren.";
                break;
            case 'kookpot':
                message.textContent += " Gebruik energie-efficiënte kookpotten om energie te besparen en duurzaamheid te bevorderen.";
                break;
            case 'pan':
                message.textContent += " Kies voor pannen met een anti-aanbaklaag om het gebruik van olie te verminderen en afval te minimaliseren.";
                break;
            case 'bestek':
                message.textContent += " Gebruik herbruikbaar roestvrijstalen bestek om plastic afval te verminderen en duurzaamheid te bevorderen.";
                break;
            case 'vergiet':
                message.textContent += " Kies voor een roestvrijstalen vergiet om plastic afval te verminderen en duurzaamheid te bevorderen.";
                break;
            case 'thermovles':
                message.textContent += " Gebruik een thermosfles om wegwerpverpakkingen te vermijden en energie te besparen.";
                break;
            case 'broodmess':
                message.textContent += " Kies voor een hoogwaardig broodmes dat lang meegaat en afval minimaliseert.";
                break;
            default:
                message.textContent += " Blijf ontdekken om meer duurzaamheidstips te leren met Berghoff!";
                break;
        }

        messageContainer.appendChild(message);

        // Automatically remove the message after a certain time
        setTimeout(() => {
            message.remove();
        }, 8000);
    }

    // Function to check drop zones
    function checkDrop(draggable) {
        const rect = draggable.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dropZone = Array.from(dropZones).find(zone => {
            const zoneRect = zone.getBoundingClientRect();
            return centerX >= zoneRect.left && centerX <= zoneRect.right &&
                centerY >= zoneRect.top && centerY <= zoneRect.bottom;
        });

        if (dropZone && dropZone.dataset.target === draggable.id) {
            // Correct drop - position draggable in the middle of the drop zone
            const dropZoneRect = dropZone.getBoundingClientRect();
            const parentRect = dropZone.parentNode.getBoundingClientRect();

            const dropZoneCenterX = dropZoneRect.left + (dropZoneRect.width / 2);
            const dropZoneCenterY = dropZoneRect.top + (dropZoneRect.height / 2);

            const draggableCenterX = draggable.offsetWidth / 2;
            const draggableCenterY = draggable.offsetHeight / 2;

            draggable.style.left = `${dropZoneCenterX - parentRect.left - draggableCenterX}px`;
            draggable.style.top = `${dropZoneCenterY - parentRect.top - draggableCenterY}px`;
            draggable.style.pointerEvents = 'none'; // Disable further dragging
            draggable.classList.add('correct'); // Indicate correct placement

            showCongratulatoryMessage(draggable.id); // Show congratulatory message

            // Check if all draggable items are correctly placed
            const allCorrect = Array.from(draggables).every(item => item.classList.contains('correct'));
            if (allCorrect) {
                // Redirect to the korting page
                window.location.href = 'korting.html'; // Adjust the path if needed
            }
        } else {
            // Incorrect drop
            draggable.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Indicate incorrect placement
            showMessage('Probeer het opnieuw. We geloven in jou, je kunt het!');
        }
    }

    // Exit button functionality
    const exitButton = document.getElementById('exit-button');
    exitButton.addEventListener('click', () => {
        // Redirect to the specified URL
        window.location.href = 'https://berghoff-belgium.be/';
    });
});

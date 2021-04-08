function openCalculator(orderId) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
                chrome.runtime.sendMessage({
                    type: 'loadOrder',
                    orderId: orderId
                }, (response) => {
                });
            } else {
                console.log(`Failed to fetch order: ${xhr.status}`);
            }
        }
    };

    xhr.open('GET', `/online/he/my-account/orders/${orderId}`, true);
    xhr.send();
}

let observer = new MutationObserver(mutations => {
    for (let mutation of mutations) {
         for (let node of mutation.addedNodes) {
            // skip non HTML nodes (e.g. text nodes)
            if (!(node instanceof HTMLElement))
                continue;

            if (node.getElementsByClassName('myOrderList').length > 0) {
                for (let btnContainer of node.getElementsByClassName('btnContainer')) {
                    let orderId = btnContainer.getElementsByTagName('span')[0].innerText;

                    let btn = document.createElement('div');
                    btn.classList.add('block');

                    let btnLink = document.createElement('a');
                    btnLink.classList.add('btn', 'big', 'hollow');
                    btnLink.innerText = 'מחשבון שותפים';
                    btn.appendChild(btnLink);
                    btn.onclick = function() {
                        openCalculator(orderId);
                    };

                    btnContainer.prepend(btn);
                }
            }
        }
    }
});

observer.observe(document, { 
    childList: true,
    subtree: true,
});
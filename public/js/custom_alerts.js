//Inserts notification in first located <header> tag or in parent
//Possible types: success, info, warning, danger
//textNode - type node
function showNotification(type, textNode, parent) {
    if(!parent) parent = document.getElementsByTagName('header')[0];
    if(parent.getElementsByClassName('alert').length > 0) return false;
    // Создаем div элемент с нужными классами
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissable`;

    // Создаем ссылку для закрытия алерта
    const closeLink = document.createElement('a');
    closeLink.href = '#';
    closeLink.className = 'close float-end';
    closeLink.setAttribute('data-bs-dismiss', 'alert');
    closeLink.setAttribute('aria-label', 'close');

    // Создаем иконку для ссылки закрытия
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';

    // Добавляем иконку в ссылку
    closeLink.appendChild(closeIcon);

    // Добавляем элементы в div
    alertDiv.appendChild(closeLink);
    alertDiv.appendChild(textNode);

    // Добавляем созданный элемент в body
    parent.appendChild(alertDiv);

    return true;
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
    // Initialize Search component
    initializeSearchComponent('.search-bar');
    $('.selectpicker').selectpicker();


});


// -------
// function to close custom modal
function hideCustomModal(modalId) {
    let modal = document.getElementById(modalId);

    if (modal) {
        document.activeElement.blur();
        $('#' + modalId).modal('hide');

    }
}

// ÷----------
// Function to initialize a search component
function initializeSearchComponent(searchBarSelector) {
    const searchBar = document.querySelector(searchBarSelector);
    if (!searchBar) return; // Exit if the element doesn't exist

    const searchInput = searchBar.querySelector('.search-input');
    const clearInputIcon = searchBar.querySelector('.clear-input-icon');

    // Input Event: Show/Hide the Clear Icon
    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.trim();
        if (searchValue !== '') {
            clearInputIcon.style.display = 'inline';
        } else {
            clearInputIcon.style.display = 'none';
        }
    });

    // Clear Icon Click Event: Reset Input Field
    clearInputIcon.addEventListener('click', function () {
        searchInput.value = '';
        clearInputIcon.style.display = 'none';
    });
};

//  --------

// Initialize the tag system for any section
function initializeTags(containerId, keywordList, searchBar) {
    const container = document.getElementById(containerId);
    const Keywordlist = document.getElementById(keywordList);
    const searchBarElement = document.getElementById(searchBar);

    // Make sure the container exists
    if (!container) return;

    const selectedTagsContainer = container.querySelector('.selected-tags');
    // Event listener for all keywords
    Keywordlist.querySelectorAll('.keywords-list .keyword').forEach(keyword => {
        keyword.addEventListener('click', function () {
            const keywordText = this.getAttribute('data-keyword');
            toggleTag(keywordText, selectedTagsContainer);

        });
    });

    // Event listener for add button
    $(".add-new-keyword").click(function () {
        // Get the value from the corresponding search bar
        let newKeyword = searchBarElement.querySelector('.search-input').value.trim();

        if (newKeyword) {
            // Add a pending keyword with the value from the input
            addTagWithPendingApproval(newKeyword, selectedTagsContainer);
            // Clear the input field after adding the keyword
            searchBarElement.querySelector('.search-input').value = '';
        }
        // Hide the close icon when input field is cleared
        if ($(".search-input").val().trim() === "") {
            $(".clear-input-icon").hide(); // Hide the clear icon if input is empty
        } else {
            $(".clear-input-icon").show(); // Show the clear icon if input has value
        }
    });
    function toggleTag(keywordText, tagsContainer) {
        // Check if the tag already exists in the container
        const existingTag = tagsContainer.querySelector(`.tag-item[data-tag="${keywordText}"]`);

        // If the tag already exists, remove it
        if (existingTag) {
            existingTag.remove(); // Remove the tag from the selected container
            const keywordElement = Keywordlist.querySelector(`.keywords-list .keyword[data-keyword="${keywordText}"]`);
            const plusSign = keywordElement.querySelector('.add-icon');
            keywordElement.classList.remove('added');
            plusSign.style.display = 'inline';
            return;
        }


        // Create the tag
        const tag = document.createElement('div');
        tag.classList.add('tag-item');
        tag.setAttribute('data-tag', keywordText);
        tag.innerHTML = `
            <span class="tag-text">${keywordText}</span>
            <span class="tag-remove">
                  <img src="images/icons/close.svg" class="add-icon close-icon" alt="">
            </span>
        `;

        // Tag remove functionality
        tag.querySelector('.tag-remove').addEventListener('click', function () {
            tag.remove();
            const keyword = Keywordlist.querySelector(`.keywords-list .keyword[data-keyword="${keywordText}"]`);
            const plusSign = keyword.querySelector('.add-icon');
            keyword.classList.remove('added');
            plusSign.style.display = 'inline';

        });

        // Append the new tag to the container
        tagsContainer.appendChild(tag);

        // Update the keyword item to show the check mark
        const keywordElement = Keywordlist.querySelector(`.keywords-list .keyword[data-keyword="${keywordText}"]`);
        const plusSign = keywordElement.querySelector('.add-icon');
        keywordElement.classList.add('added');
        plusSign.style.display = 'none';
    }

    // add a new 
    // Pending approval function
    function addTagWithPendingApproval(keywordText, tagsContainer) {
        // Check if the tag already exists
        const existingTag = tagsContainer.querySelector(`.tag[data-tag="${keywordText}"]`);

        if (existingTag) return;

        // Create the pending tag
        const tag = document.createElement('div');
        tag.classList.add('tag-item', 'pending');
        tag.setAttribute('data-tag', keywordText);
        tag.innerHTML = `
           <div class="tag-text">${keywordText}</div>
    <div class="d-flex align-items-center">
        <!-- Tooltip -->
          <button type="button" class="btn p-0 tooltip-btn" data-bs-toggle="tooltip" data-bs-placement="top"
        title="Pending Keyword">
        <img src="../images/icons/info-f.svg" alt="">
    </button>
        <!-- Remove Button -->
        <div class="tag-remove">
            <img src="images/icons/close.svg" class="close-icon" alt="Remove">
        </div>
    </div>
        `;

        // Tag remove functionality
        tag.querySelector('.tag-remove').addEventListener('click', function () {
            tag.remove();
        });

        // Append the pending tag to the container
        tagsContainer.appendChild(tag);

        // Initialize the tooltip for the newly added button
        const tooltipTrigger = tag.querySelector('[data-bs-toggle="tooltip"]');
        if (tooltipTrigger) {
            new bootstrap.Tooltip(tooltipTrigger);
        }


    }
}
// ---------

$('.selectpicker').on('shown.bs.select', function () {
    $(this).closest('.bootstrap-select').addClass('focused-border');
});

$('.selectpicker').on('hidden.bs.select', function () {
    $(this).closest('.bootstrap-select').removeClass('focused-border');
});

// -------

// Function to validate form based on form ID
function validateForm(formId) {
    let formValid = true; // Flag to track if the form is valid

    // Loop through each input, select, and textarea element in the form
    $(formId).find('input, select, textarea').each(function () {
        // Validate each field and if it is invalid, set formValid to false
        if (!validateField($(this))) {
            formValid = false;
        }
    });

    // Check if the form has custom selection fields and validate them
    if ($(formId).find('.selection-box').length > 0) {
        if (!validateSelection()) {
            formValid = false; // If selection validation fails, mark the form as invalid
        }
    }


    return formValid; // Return the validation result
}

// Function to validate individual fields
function validateField($field) {
    const value = $field.val() ? $field.val().trim() : '';
    const validations = $field.data('validation') ? $field.data('validation').split(' ') : [];
    const errorDiv = $field.closest('.form-group').find('.error');

    // Clear previous error
    errorDiv.text('').removeClass('text-danger');

    // Loop through each validation type
    for (let i = 0; i < validations.length; i++) {
        const validation = validations[i];

        // Required field validation
        if (validation === 'required' && (value === '' || value === null || value === undefined)) {
            // For selectpicker, use a more specific error message
            if ($field.is('select')) {
                errorDiv.text('Please select an option').addClass('text-danger');
            } else {
                errorDiv.text('This field is required').addClass('text-danger');
            }
            return false;
        }

        // Username validation (only if not empty)
        if (validation === 'username' && value !== '') {
            const usernameValidationMessage = validateUsername(value);
            if (usernameValidationMessage !== "") {
                errorDiv.text(usernameValidationMessage).addClass('text-danger');
                return false;
            }
        }

        // Email validation
        if (validation === 'email' && value !== '' && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
            errorDiv.text('Please enter a valid email address').addClass('text-danger');
            return false;
        }
    }



    return true; // Return true if the field is valid
}

// Clear error message on input, select, and textarea interactions
$('input, select, textarea').on('input change', function () {
    const $field = $(this);
    const errorDiv = $field.closest('.form-group').find('.error');

    // Remove error message and border if the field is valid
    errorDiv.text('');
});


// Function to validate custom selection (Business Type)
function validateSelection() {
    const selectedOption = $('.selection-box.selected'); // Check if an option is selected
    const errorDiv = $('.business-type-error'); // Error message container

    // Clear previous error
    errorDiv.text('').removeClass('text-danger');

    if (selectedOption.length === 0) {
        // If no option is selected, show an error
        errorDiv.text('Please select an option.');
        return false;
    }

    return true;
}

/**
 * Handles selection of a business type, updates the UI to reflect the selection, 
 * clears any associated error messages, and updates the hidden input value.
 */
function selectBox(box) {
    // Remove 'selected' class from all selection boxes
    document.querySelectorAll('.selection-box').forEach(el => {
        el.classList.remove('selected');
    });

    // Add 'selected' class to the clicked box
    box.classList.add('selected');

    // Remove the error message when a selection is made
    const errorDiv = document.querySelector('.business-type-error');
    if (errorDiv) {
        errorDiv.textContent = ''; // Clear the error message
        errorDiv.classList.remove('text-danger'); // Remove the error style
    }

    // Update the hidden input with the selected value (optional)
    const selectedOption = box.querySelector('p').textContent.trim();
    document.getElementById('businessType').value = selectedOption.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Validates whether a given username is correct or not
 * @param {string} username - The username to be validated.
 * @returns {boolean} - Returns `true` if the username is valid, `false` otherwise.
 */
function validateUsername(username) {
    // Length requirement
    if (username.length < 5 || username.length > 20) {
        return "Username must be between 5 and 20 characters long.";
    }

    // No only numbers or underscores, or a combination of both
    const onlyNumbersOrUnderscoresRegex = /^[_\d]+$/;
    if (onlyNumbersOrUnderscoresRegex.test(username)) {
        return "Username cannot consist of only numbers, only underscores, or a combination of both.";
    }
    // Username should not start with a number
    const startsWithNumberRegex = /^\d/;
    if (startsWithNumberRegex.test(username)) {
        return "Username cannot start with a number.";
    }
    // Allowed characters: letters, numbers, and underscores
    const allowedCharactersRegex = /^[a-zA-Z0-9_]+$/;
    if (!allowedCharactersRegex.test(username)) {
        return "Username can only contain letters, numbers, and underscores, with no spaces.";
    }

    // If all validations pass
    return "";
}

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email address is valid, otherwise false.
 */
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Validates a phone number.
 * @param {string} phoneValue - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, otherwise false.
 */
function validatePhone(phoneValue) {

    // Check if the phone number contains any alphabetic characters
    if (/[a-zA-Z]/.test(phoneValue)) {
        return false;
    } else if (!(iti.isValidNumberPrecise())) {
        // If the phone number is not valid according to ( International Telephone Input)
        return false;
    }

    // If the phone number passes all checks, return true indicating it's valid
    return true;
}

/**
 * Validates whether a given URL is correctly formatted.
 * @param {string} url - The URL to be validated.
 * @returns {boolean} - Returns `true` if the URL is valid, `false` otherwise.
 */
function isValidURL(url) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!urlPattern.test(url);
}


// ----------

function initializeRadioGroup(groupSelector) {
    const radioGroup = document.querySelectorAll(groupSelector);

    radioGroup.forEach(radio => {
        radio.addEventListener("click", function () {
            deselect_customRadios(radioGroup);
            radio.classList.add("selected");
            radio.querySelector('.radio-icon').classList.add("selected");
        });
    });
}

function deselect_customRadios(group) {
    group.forEach(radio => {
        radio.classList.remove("selected");
        radio.querySelector('.radio-icon').classList.remove("selected");
    });
}

/**
 * Function to deselect custom radio buttons.
 * @param {NodeList} radios - The NodeList containing the radio buttons to deselect.
 */
function deselect_customRadios(radios) {
    radios.forEach(radio => {
        radio.classList.remove("selected");
        radio.querySelector('.radio-icon').classList.remove("selected");
    });
}

/**
 * Retrieves the selected value of a radio group.
 * @param {NodeList} radios - The NodeList of radio buttons in the group.
 * @returns {string|null} - The value of the selected radio button, or null if none is selected.
 */
function getSelectedValue(radios) {
    let selectedValue = null;
    radios.forEach(radio => {
        if (radio.classList.contains("selected")) {
            selectedValue = radio.getAttribute("data-value");
        }
    });
    return selectedValue;
}

// ----------

//  =========== Function to update selected items in the corresponding section
function updateSelectedItems(selectId, targetId) {
    var selectedItems = $(selectId).val() || [];
    var targetContainer = $(targetId);

    // Clear the existing items in the target container
    targetContainer.empty();

    // Add selected items to the target container
    selectedItems.forEach(function (item) {
        var tag = $(`<div class="tag-item">
             <span class="tag-text">${item}</span>
            <span class="tag-remove">
                  <img src="images/icons/close.svg" class="add-icon close-icon" alt="">
            </span>
            </div>`);
        targetContainer.append(tag);
        // Add click event for tag removal
        tag.find('.tag-remove').on('click', function () {
            // Remove the tag from the container
            tag.remove();

            // Unselect the corresponding value in the selectpicker
            var selectElement = $(selectId);
            var updatedValues = selectElement.val().filter(val => val !== item);

            // Update the selectpicker with new values and refresh it
            selectElement.val(updatedValues).selectpicker('refresh');
        });


    });

}

// Update selected provinces when an item is selected or deselected
$('#provinces').on('changed.bs.select', function () {
    updateSelectedItems('#provinces', '#selectedProvinces');
});

// Update selected regions when an item is selected or deselected
$('#regions').on('changed.bs.select', function () {
    updateSelectedItems('#regions', '#selectedRegions');
});
// Update selected countries when an item is selected or deselected
$('#countrySelect').on('changed.bs.select', function () {
    updateSelectedItems('#countrySelect', '#selectedCountries');
});

// ------------
/**
 * Adds and removes the 'active' class on the label element corresponding to the input field
 * based on focus and input events.
 */
$('.form-field input').each(function () {
    // Check on page load
    if ($(this).val().trim() !== '') {
        $(this).siblings('label').addClass('active');
    }


    $(this).on('focus', function () {
        $(this).siblings('label').addClass('active');
    });

    $(this).on('blur', function () {
        if ($(this).val().trim() === '') {
            $(this).siblings('label').removeClass('active');
        }
    });

    $(this).on('input', function () {
        $(this).siblings('label').addClass('active');
    });
});
// ------------
// Convert all the buttons with data-toggle and data-target to use Bootstrap 5 modal
var oldModalButtons = document.querySelectorAll('[data-toggle="modal"]');
oldModalButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var target = button.getAttribute('data-target');
        var modalElement = document.querySelector(target);
        var modal = new bootstrap.Modal(modalElement);
        modal.show();
    });
});

// Handle closing modals
var closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"], [data-dismiss="modal"]');
closeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        var modalElement = button.closest('.modal');
        var modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    });
});

// -----------
/**
 * Handles the display of a keyword list with a "More" link and modal for extra keywords.
 * 
 * @param {string} keywordListSelector - The selector for the keyword list container.
 * @param {string} modalSelector - The selector for the modal where extra keywords will be displayed.
 * @param {number} [keywordLimit=15] - The maximum number of keywords to display in the main list before showing the "More" link.
 */
function handleKeywords(keywordListSelector, modalSelector, keywordLimit = 15) {
    const keywordsList = $(keywordListSelector);
    const allKeywords = keywordsList.children('.keyword-link'); // All keyword links
    const modalKeywordsContainer = $(`${modalSelector} .all-keywords`);

    // Initially show only the first 'keywordLimit' number of keywords
    allKeywords.each(function (index) {
        if (index >= keywordLimit) {
            $(this).hide(); // Hide extra keywords from the main list
        }
    });

    // If there are more than the specified 'keywordLimit', add a "More" button
    if (allKeywords.length > keywordLimit) {
        const moreButton = $('<a href="#!" class="keyword-link" data-bs-toggle="modal" data-bs-target="' + modalSelector + '">More</a>');
        keywordsList.append(moreButton);
    }
}
// ---------
function truncateText(elementId) {
    const paragraph = document.getElementById(elementId);
    const originalText = paragraph.textContent.trim();  // Get the original text
    const words = originalText.split(/\s+/);  // Split by spaces
    const maxWords = 98;

    // Check if the text length exceeds the maxWords limit
    if (words.length > maxWords) {
        // Truncate the text at maxWords
        const truncatedText = words.slice(0, maxWords - 5).join(' '); // Up to maxWords - 5
        const blurredText = words.slice(maxWords - 5, maxWords).join(' '); // Last 5 words

        // Set the truncated text with the last 5 words blurred and followed by "..."
        paragraph.innerHTML = `
            ${truncatedText} 
            <span class="blurred">${blurredText}</span>...
        `;

        // Add "Show More" button functionality
        const button = document.getElementById('toggleButton');
        let isExpanded = false;

        button.onclick = function () {
            if (isExpanded) {
                // Show truncated text again with blurred last 5 words
                paragraph.innerHTML = `
                    ${truncatedText} 
                    <span class="blurred">${blurredText}</span>...
                `;
                button.textContent = 'Show More';
            } else {
                // Show full text
                paragraph.innerHTML = originalText;
                button.textContent = 'Show Less';
            }
            isExpanded = !isExpanded;
        };
    } else {
        // If text is less than or equal to maxWords, display the full text
        paragraph.innerHTML = originalText;
        const button = document.getElementById('toggleButton');
        button.style.display = 'none';  // Hide the button if no truncation is needed
    }
}
// --------

/**
 * Populates the opening hours table.
 * @param {Object} openingHours - Object containing opening hours data.
 */
function populateOpeningHoursTable(openingHours) {
    const table = document.querySelector(".hours-table");
    const currentDate = new Date();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayTime = getCurrentDayAndTime();
    const currentDay = currentDayTime['day'];
    const currentTime = currentDayTime['time'];
    for (const [day, hours] of Object.entries(openingHours)) {
        const row = document.createElement("tr");
        row.id = day;

        if (hours.closed) {
            row.innerHTML = `
                <td class="day-of-week">${day}</td>
                <td>Closed</td>
            `;
        } else {
            row.innerHTML = `
                 <td class="day-of-week">${day}</td>
                <td>${hours.open} - ${hours.close}</td>
            `;
        }

        if (day === currentDay) {
            row.classList.add("today");
        }
        table.appendChild(row);
    }

}

/**
 * Determines if the business is currently open or closed.
 */
function determineBusinessStatus(todayHours, currentTime) {
    let businessStatusLabel = document.querySelector(".business-status-label")
    let = statusIndicator = document.querySelector(".status-indicator");
    // Check if the business is closed or if any opening/closing time is missing
    if (
        !todayHours ||
        todayHours.closed ||
        !todayHours.open ||
        !todayHours.close
    ) {
        if (businessStatusLabel) {
            businessStatusLabel.classList.remove("open");
            businessStatusLabel.classList.remove("closed");
        }
        if (statusIndicator) {
            statusIndicator.classList.remove("green");
        }
        return "closed";
    }
    const currentTimes = getCurrentTimeInMinutes(currentTime);
    const openTime = convertTo24Hour(todayHours.open);
    const closeTime = convertTo24Hour(todayHours.close);

    if (currentTimes >= openTime && currentTimes <= closeTime) {
        businessStatusLabel.classList.remove("closed");
        businessStatusLabel.classList.add("open");
        statusIndicator.classList.add("green");
        return "open";
    } else {
        businessStatusLabel.classList.remove("open");
        businessStatusLabel.classList.add("closed");
        statusIndicator.classList.remove("green");
        return "closed";
    }
}

/**
 * Converts 12-hour time to 24-hour format.
 * @param {string} timeString - Time in 12-hour format (e.g., "09:00 AM").
 * @returns {string|null} - Time in 24-hour format (e.g., "09:00").
 */
function convertTo24Hour(timeString) {
    if (!timeString) return null;

    let [time, period] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number); // Convert hours and minutes to numbers

    if (period.toLowerCase() === "pm" && hours !== 12) {
        hours += 12;
    } else if (period.toLowerCase() === "am" && hours === 12) {
        hours = 0;
    }

    return hours * 60 + minutes; // Return time as minutes since midnight
}

// Get current day and time
function getCurrentDayAndTime() {
    const currentDate = new Date();
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return {
        day: weekday[currentDate.getDay()],
        time: `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`
    };
}

function getCurrentTimeInMinutes(currentTimeString) {
    let [hours, minutes] = currentTimeString.split(":").map(Number); // Convert hours and minutes to numbers
    return hours * 60 + minutes; // Return as minutes since midnight
}

// Displays today's opening hours in the format "Thu, 9:00 - 17:00" inside the specified span.
function displayTodaysOpeningHours(currentDay, todayHours) {

    const todaysOpeningHoursSpan = document.querySelector(".todaysOpeningHours");

    // Check if todayHours is missing or marked as closed
    if (!todayHours || todayHours.closed || !todayHours.open || !todayHours.close) {
        todaysOpeningHoursSpan.innerHTML = `${currentDay.substring(0, 3)}, <span class="red-text">Closed</span>`;
        return;
    }


    // Format opening and closing times in 24-hour format
    const openTime = convertTo24Hour(todayHours.open);
    const closeTime = convertTo24Hour(todayHours.close);

    const formattedOpen = formatTime(openTime);
    const formattedClose = formatTime(closeTime);

    todaysOpeningHoursSpan.textContent = `${currentDay.substring(0, 3)}, ${formattedOpen} - ${formattedClose}`;
}
//  function to format minutes since midnight into "HH:mm" format
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`; // Pad minutes with leading zero if needed
}
// -----------
// This code dynamically adjusts the layout by removing or restoring parent divs based on screen size
if (document.body.classList.contains('has-responsive-layout')) {

    // Define a media query for the specific screen size
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    // Function to remove a parent div and keep its children
    const removeParentDiv = (parentId) => {
        const parentDiv = document.getElementById(parentId);

        if (!parentDiv) {
            return;
        }

        const businessCardsHolder = parentDiv.parentElement;

        // Reassign all children from the parent div to the businessCardsHolder
        const children = [...parentDiv.children]; // Copy the children nodes
        children.forEach(child => businessCardsHolder.insertBefore(child, parentDiv));

        // Remove the parent div from the DOM
        parentDiv.remove();
    };

    // Function to create a new parent div and move its children back
    const restoreParentDiv = (parentId, children) => {
        const businessCardsHolder = document.getElementById('businessCardsHolder'); // ID of businessCardsHolder
        const newParentDiv = document.createElement('div');
        newParentDiv.id = parentId; // Restore the same ID
        newParentDiv.className = 'parent'; // Any necessary classes

        // Append the stored children to the new parent div
        children.forEach(child => newParentDiv.appendChild(child));

        // Insert the new parent div into the businessCardsHolder
        businessCardsHolder.appendChild(newParentDiv);
    };

    // Variable to store removed parent divs' children for restoration
    const removedParents = {};

    // Function to handle media query changes
    const checkMediaQuery = (e) => {
        if (e.matches) {
            // If screen size is ≤ 600px, remove the parent divs and store their children
            const parent1Children = document.getElementById('column1')?.children;
            if (parent1Children) {
                removedParents['column1'] = [...parent1Children]; // Store a copy of the children
                removeParentDiv('column1');
            }

            const parent2Children = document.getElementById('column2')?.children;
            if (parent2Children) {
                removedParents['column2'] = [...parent2Children];
                removeParentDiv('column2');
            }
        } else {
            // If screen size is > 600px, restore the parent divs
            if (removedParents['column1']) {
                restoreParentDiv('column1', removedParents['column1']);
                delete removedParents['column1']; // Remove from storage
            }

            if (removedParents['column2']) {
                restoreParentDiv('column2', removedParents['column2']);
                delete removedParents['column2']; // Remove from storage
            }
        }
    };

    // Add the media query event listener
    mediaQuery.addEventListener('change', checkMediaQuery);

    // Initial check to ensure the correct operation on page load
    checkMediaQuery(mediaQuery);
}
// ------------
// Function to render reviews based on the current page
function renderReviews(reviews, page, reviewsPerPage) {
    const reviewsContainer = document.getElementById("reviews-container");
    reviewsContainer.innerHTML = ""; // Clear existing reviews

    const start = (page - 1) * reviewsPerPage; // Start index
    const end = Math.min(start + reviewsPerPage, reviews.length); // End index

    for (let i = start; i < end; i++) {
        const review = reviews[i];
        const reviewElement = createReview(review, i); // Create a review element
        reviewsContainer.appendChild(reviewElement);
        applyTransition(reviewElement); // Apply the transition to the review
    }
}

function renderPagination(reviews, reviewsPerPage, currentPage) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = ""; // Clear existing pagination controls
    const totalPages = Math.ceil(reviews.length / reviewsPerPage); // Total number of pages
    const maxVisiblePages = 2; // Number of pages shown on either side of the current page

    const pageNumbersContainer = document.createElement("div");
    pageNumbersContainer.className = "page-numbers-container"; // Wrapper for page numbers

    // Helper function to create a page button
    const createPageButton = (pageNumber) => {
        const pageButton = document.createElement("button");
        pageButton.className = `page ${currentPage === pageNumber ? "active" : ""}`; // Highlight the current page
        pageButton.textContent = pageNumber;
        pageButton.disabled = currentPage === pageNumber; // Disable if it's the current page
        pageButton.addEventListener("click", () => {
            if (currentPage !== pageNumber) {
                currentPage = pageNumber; // Update the current page
                renderReviews(reviews, currentPage, reviewsPerPage); // Re-render reviews
                renderPagination(reviews, reviewsPerPage, currentPage); // Re-render pagination
            }
        });
        return pageButton;
    };

    // Previous button with consistent styling
    const prevButton = document.createElement("button");
    prevButton.className = `navigation-button ${currentPage === 1 ? "disabled" : ""}`;
    prevButton.innerHTML = `<i class="fa-solid fa-chevron-left"></i>`; // FontAwesome left arrow
    prevButton.disabled = currentPage === 1; // Disable if on the first page
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--; // Go to the previous page
            renderReviews(reviews, currentPage, reviewsPerPage); // Re-render reviews
            renderPagination(reviews, reviewsPerPage, currentPage); // Re-render pagination
        }
    });

    pagination.appendChild(prevButton); // Add to pagination

    // If there are few pages, show all page numbers
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbersContainer.appendChild(createPageButton(i));
        }
    } else {
        pageNumbersContainer.appendChild(createPageButton(1)); // First page

        if (currentPage > maxVisiblePages + 2) {
            pageNumbersContainer.appendChild(document.createTextNode("...")); // Ellipsis
        }

        const startPage = Math.max(2, currentPage - maxVisiblePages); // Starting page
        const endPage = Math.min(totalPages - 1, currentPage + maxVisiblePages); // Ending page

        for (let i = startPage; i <= endPage; i++) {
            pageNumbersContainer.appendChild(createPageButton(i));
        }

        if (currentPage < totalPages - maxVisiblePages - 1) {
            pageNumbersContainer.appendChild(document.createTextNode("...")); // Ellipsis if needed
        }

        pageNumbersContainer.appendChild(createPageButton(totalPages)); // Last page
    }

    pagination.appendChild(pageNumbersContainer); // Add all page buttons to the wrapper

    // Next button with consistent styling
    const nextButton = document.createElement("button");
    nextButton.className = `navigation-button ${currentPage === totalPages ? "disabled" : ""}`;
    nextButton.innerHTML = `<i class="fa-solid fa-chevron-right"></i>`; // FontAwesome right arrow
    nextButton.disabled = currentPage === totalPages; // Disable if on the last page
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++; // Go to the next page
            renderReviews(reviews, currentPage, reviewsPerPage); // Re-render reviews
            renderPagination(reviews, reviewsPerPage, currentPage); // Re-render pagination
        }
    });

    pagination.appendChild(nextButton); // Add to pagination
}
// Calculate the average rating
const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0; // Handle case where there are no reviews

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return Math.round(averageRating * 10) / 10;
};
// function for creating reviews
function createReview(review, index) {
    const reviewDiv = document.createElement("div");
    reviewDiv.className = "review";

    // Create the star rating
    const starsDiv = document.createElement("div");
    starsDiv.className = "stars";

    // Add full stars and check for half star
    const filledStars = Math.floor(review.rating);
    const hasHalfStar = review.rating % 1 !== 0;

    for (let i = 0; i < filledStars; i++) {
        const star = document.createElement("span");
        star.className = "star filled";
        star.textContent = "\u2605"; // Unicode for filled star
        starsDiv.appendChild(star);
    }

    if (hasHalfStar) {
        const star = document.createElement("span");
        star.className = "star half"; // Class for half star
        star.textContent = "\u2605"; // Unicode for half star
        starsDiv.appendChild(star);
    }

    // Add empty stars to complete 5 stars
    for (let i = filledStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.textContent = "\u2605"; // Unicode for empty star
        starsDiv.appendChild(star);
    }

    reviewDiv.appendChild(starsDiv); // Add star ratings to the review

    // Truncated text with "Show More/Show Less" functionality
    const reviewTextDiv = document.createElement("div");
    reviewTextDiv.className = "truncated-text";

    const wordLimit = 35; // Word limit for truncation
    const fullText = review.content; // Full text of the review
    const words = fullText.split(" "); // Split into words
    const truncatedText = words.slice(0, wordLimit).join(" ") + (words.length > wordLimit ? "..." : "");

    const paragraph = document.createElement("p");
    paragraph.textContent = truncatedText; // Set the initial text

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("borderless-btn", "show-more-link");
    toggleButton.textContent = "Show More"; // Default text for the button
    toggleButton.classList.add("toggle-btn");

    if (words.length > wordLimit) { // Only show the toggle button if text exceeds the limit
        paragraph.appendChild(toggleButton);
    }

    // Toggle between full and truncated text
    toggleButton.addEventListener("click", function () {
        if (toggleButton.textContent === "Show More") {
            paragraph.textContent = fullText; // Show full text
            paragraph.appendChild(toggleButton); // Re-append the toggle button
            toggleButton.textContent = "Show Less"; // Change to "Show Less"
        } else {
            paragraph.textContent = truncatedText; // Show truncated text
            paragraph.appendChild(toggleButton); // Re-append the toggle button
            toggleButton.textContent = "Show More"; // Change to "Show More"
        }
    });

    reviewTextDiv.appendChild(paragraph); // Add paragraph to the text div
    reviewDiv.appendChild(reviewTextDiv); // Add truncated text to the review div

    // Add product link with heading
    let purchasedProductLink = review.productLink.trim();;
    if (purchasedProductLink !== "" && /^(ftp|http|https):\/\/[^ "]+$/.test(purchasedProductLink)) {
        const productLinkDiv = document.createElement("div");
        productLinkDiv.className = "product-link";

        const heading = document.createElement("span"); // Create a strong element for the heading
        heading.textContent = "Purchased Product/Service: "; // Heading text

        const productLink = document.createElement("a");
        productLink.href = review.productLink; // Product link from the review data
        productLink.textContent = review.productLink; // Display the link text itself

        productLinkDiv.appendChild(heading); // Append the heading to the product link div
        productLinkDiv.appendChild(productLink); // Append the link to the product link div

        reviewDiv.appendChild(productLinkDiv); // Add product link div to the review

    }


    // Profile information (image, name, and date)
    const profileDiv = document.createElement("div");
    profileDiv.className = "user-info";

    const profileImage = document.createElement("img");
    profileImage.className = "user-image";
    profileImage.src = review.profileImage;
    profileDiv.appendChild(profileImage);

    const profileText = document.createElement("span");
    profileText.textContent = `${review.userName} - ${review.date}`;
    profileDiv.appendChild(profileText);

    reviewDiv.appendChild(profileDiv); // Add profile information

    return reviewDiv; // Return the complete review element
}
// Function to apply a transition effect to reviews
function applyTransition(element) {
    setTimeout(() => {
        element.classList.add("show");
    }, 100);
}
// Function to set the progress bar widths based on rating counts
function setRatingProgress(ratingCounts, totalRatings) {
    // Calculate the percentage for each star rating
    const percentage = (count) => (count / totalRatings) * 100;

    const progressBars = {
        'five-star-progress': percentage(ratingCounts['five-star']),
        'four-star-progress': percentage(ratingCounts['four-star']),
        'three-star-progress': percentage(ratingCounts['three-star']),
        'two-star-progress': percentage(ratingCounts['two-star']),
        'one-star-progress': percentage(ratingCounts['one-star']),
    };
    const starCounts = {
        'five-star-count': ratingCounts['five-star'],
        'four-star-count': ratingCounts['four-star'],
        'three-star-count': ratingCounts['three-star'],
        'two-star-count': ratingCounts['two-star'],
        'one-star-count': ratingCounts['one-star'],
    };
    // Update each progress bar's width
    Object.keys(progressBars).forEach((id) => {
        const progressBar = document.getElementById(id);
        if (progressBar) {
            progressBar.style.width = `${progressBars[id]}%`; // Set width according to the percentage

            // Set color based on the percentage
            progressBar.style.backgroundColor =
                percentage > 0 ? 'gray' : '#FFA41C'; // Orange if filled, gray if 0%
        }
    });
    Object.keys(starCounts).forEach((id) => {
        const countElement = document.getElementById(id);
        if (countElement) {
            countElement.textContent = `${starCounts[id]}`; // Display the count
        }
    });
}
function setStarRating(rating) {
    const stars = document.querySelectorAll('.star-rating .star'); // Get all stars

    // Loop through each star and determine whether to fill it
    stars.forEach((star, index) => {
        if (index < Math.floor(rating)) {
            star.classList.add('filled'); // Fully fill the star if the index is less than the integer part of the rating
        } else if (index < rating && index + 1 > rating) {
            // Fill partially if there's a decimal part
            star.style.background = `linear-gradient(to right, #FFA41C ${100 * (rating - index)}%, rgb(231, 231, 231) 0%)`;
        } else {
            star.classList.remove('filled'); // Leave the star unfilled
            star.style.background = ''; // Reset any linear gradients
        }
    });
}

// Main function to process reviews and set rating progress
function processReviews(reviews, totalRatings) {
    // Initialize rating counts
    const ratingCounts = {
        'five-star': 0,
        'four-star': 0,
        'three-star': 0,
        'two-star': 0,
        'one-star': 0
    };

    // Count the ratings
    reviews.forEach((review) => {
        if (review.rating === 5) ratingCounts['five-star']++;
        if (review.rating === 4) ratingCounts['four-star']++;
        if (review.rating === 3) ratingCounts['three-star']++;
        if (review.rating === 2) ratingCounts['two-star']++;
        if (review.rating === 1) ratingCounts['one-star']++;
    });

    // Call function to update progress bars and counts
    setRatingProgress(ratingCounts, totalRatings);
}

// -----------
let savedToList = '';
function updateHeartIconFill(isFilled) {
    const heartIcon = document.querySelector('#heartIcon');
    if (isFilled) {
        heartIcon.classList.add('saved');
    } else {
        heartIcon.classList.remove('saved');
    }
}
function populateLists(lists) {
    const existingLists = document.getElementById('existingLists');
    existingLists.innerHTML = ''; // Clear existing content

    lists.forEach(list => {
        const listItem = document.createElement('div');
        listItem.classList.add('list', 'd-flex', 'align-items-center');// Add 'saved-list' class if the list is saved
        if (list === savedToList) {
            listItem.classList.add('saved-list');
        }

        // SVG string directly
        const heartIconHTML = `
        <svg class="icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
        </svg>
`;

        // Create list name
        const listName = document.createElement('p');
        listName.classList.add('list-name', 'mb-0');
        listName.textContent = list;

        // Insert SVG HTML and list name into list item
        listItem.innerHTML = heartIconHTML + listName.outerHTML;

        // Add event listener for click on the list item to save the list
        listItem.addEventListener('click', () => saveToList(list, lists));

        // Append the list item to the modal content
        existingLists.appendChild(listItem);
    });
}
// Function to save list and toggle heart icon
function saveToList(listName, lists) {
    if (savedToList === listName) {
        // If the list is already saved, toggle it off
        savedToList = '';
    } else {
        // If the list is not saved, save it
        savedToList = listName;
    }

    // Update the page heart icon based on whether a list is saved
    const isFilled = savedToList !== ''; // True if a list is saved, false otherwise

    updateHeartIconFill(isFilled);
    // Re-render the modal and the page heart icon state
    if (isFilled) {
        let toastMessage = "The item is saved in: " + listName;
        openToast("success", "", toastMessage, "inToastContainer");
    }

    populateLists(lists);

}
// Function to get the selected list name
function getSelectedListName() {
    return savedToList;
}
// ------------
function toggleModals(firstModal, secondModal) {
    // Close the first modal
    $('#' + firstModal).modal('hide');

    // Open the second modal
    $('#' + secondModal).modal('show');
}
// ------------
function isWithinCharacterLimit(text, minLimit, maxLimit) {
    return text.length >= minLimit && text.length <= maxLimit;
}
// -------------



// Function to close a specific toast with fade-out effect
const closeToast = (toast) => {
    toast.classList.remove("toast-show");
    toast.classList.add("toast-hide");

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 400); // Match this to CSS transition duration (0.4s)
};


// Function to create and display a new toast
const openToast = (type, title = "", message = "", container = "toast-container") => {
    let toastContainer = document.getElementById(container);
    const toast = document.createElement("div");
    toast.classList.add(type);
    toast.classList.add("toasts");
    if (!title) {
        toast.classList.add('no-title');
    }
    toast.innerHTML = `
    <div class="icon-wrapper">
      <div class="icon"></div>
    </div>
    <div class="toast-message">
      <h4>${title}</h4>
      <p class="mb-0">${message}</p>
    </div>
    <button class="toast-close"></button>
    </div>
  `;

    // Attach event listener to close button
    toast.querySelector(".toast-close").addEventListener("click", () => closeToast(toast));

    toastContainer.prepend(toast);
    // Trigger slide-in animation
    setTimeout(() => {
        toast.classList.add("toast-show");
    }, 20);
    setTimeout(() => closeToast(toast), 3000);
};

// -------------

/**
 * Function to update the image display
 * @param {HTMLElement} imageElement - The image element to check and display
 * @param {HTMLElement} placeholderElement - The placeholder element to show when no image is available
 * @param {string} textSource - The text source to derive the placeholder text (e.g., business name)
 */
function updateLogoDisplay(imageElement, placeholderElement, textSource) {
    // Ensure placeholder is shown by default
    placeholderElement.style.display = 'flex';
    placeholderElement.innerText = textSource.charAt(0).toUpperCase();
    imageElement.style.display = 'none';
    // Check if src is empty or not set
    if (!imageElement.src || imageElement.src === '') {
        placeholderElement.style.display = 'flex';
        placeholderElement.innerText = textSource.charAt(0).toUpperCase();
        imageElement.style.display = 'none';
    } else {
        // Create a new Image object to validate the URL
        const img = new Image();
        img.onload = function () {
            // URL is valid, show image and hide placeholder
            placeholderElement.style.display = 'none';
            imageElement.style.display = 'block';
        };
        img.onerror = function () {
            // URL is invalid, show placeholder and hide image
            placeholderElement.style.display = 'flex';
            placeholderElement.innerText = textSource.charAt(0).toUpperCase();
            imageElement.style.display = 'none';
        };
        img.src = imageElement.src;
    }
}

// ----------
// Function to render gallery items
function loadGallery(items) {
    const gallery = document.querySelector('#carousel-gallery');
    gallery.innerHTML = ''; // Clear existing content

    items.forEach(item => {
        let listItem = document.createElement('li');
        listItem.className = 'gallery-item';
        listItem.setAttribute('data-src', item.src);

        if (item.type === 'image') {
            listItem.innerHTML = `
                <a>
                    <img class="img-responsive" src="${item.src}" alt="${item.alt || ''}">
                </a>
            `;
        } else if (item.type === 'video') {
            listItem.innerHTML = `
                <div class="video-thumbnail-container">
                    <video class="img-responsive video-thumbnail" playsinline muted preload="auto">
                        <source src="${item.src}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                   <div class="play-icon-wrapper">
        <button class="play-button" aria-label="Play Video">&#9654;</button> <!-- Play button -->
    </div>
                </div>
            `;
        }

        gallery.appendChild(listItem);
    });
}


function initializeCarousel() {
    const previewModal = document.getElementById("image-preview-modal");
    const previewImage = document.getElementById("preview-img");
    const previewVideo = document.getElementById("preview-video");
    const closePreview = document.getElementById("close-preview");

    const carousel = $('#carousel-gallery');
    const galleryItemsContainer = $('#carousel-gallery'); // Parent container for gallery items
    let currentPreviewIndex = 0;
    const itemsPerSlide = 3;
    let currentIndex = 0;

    // Function to update carousel state
    function updateCarousel() {
        const galleryItems = galleryItemsContainer.find('.gallery-item');
        const totalItems = galleryItems.length;
        const offset = -currentIndex * (100 / itemsPerSlide);

        carousel.css('transform', 'translateX(' + offset + '%)');
        $('.empty-state').toggle(totalItems === 0);
        $('#carousel-gallery').toggle(totalItems > 0);

        // Enable/Disable carousel navigation buttons based on current index
        $('.carousel-prev').prop('disabled', currentIndex === 0);
        $('.carousel-next').prop('disabled', currentIndex + itemsPerSlide >= totalItems);
    }

    // Handle opening preview modal on click
    function openPreview(index) {
        const galleryItems = galleryItemsContainer.find('.gallery-item');
        if (index >= 0 && index < galleryItems.length) {
            currentPreviewIndex = index;
            const item = galleryItems.eq(index);
            const isVideo = item.find('video').length > 0;
            const mediaSrc = isVideo ? item.find('video source').attr('src') : item.find('img').attr('src');

            previewImage.style.display = isVideo ? "none" : "block";
            previewVideo.style.display = isVideo ? "block" : "none";

            if (isVideo) {
                const videoElement = item.find('video')[0];
                previewVideo.src = $(videoElement).find('source').attr('src');
                previewVideo.load();
                previewVideo.play();
            } else {
                // Set image source
                previewImage.style.display = 'block';
                previewImage.src = mediaSrc;
            }
            document.getElementById('image-counter').textContent = `${index + 1} / ${galleryItems.length}`;
            previewModal.style.display = "flex";
            previewModal.classList.add('show')
            document.body.classList.add("no-scroll");
            updateNavigationButtons();
        }
    }

    // Close preview modal
    function closePreviewModal() {
        previewModal.style.display = "none";
        document.body.classList.remove("no-scroll");
    }

    // Update navigation buttons (prev/next)
    function updateNavigationButtons() {
        $('#preview-prev').prop('disabled', currentPreviewIndex === 0);
        $('#preview-next').prop('disabled', currentPreviewIndex === galleryItemsContainer.find('.gallery-item').length - 1);
    }

    // Show next/prev media in preview modal
    function showNextMedia() {
        if (currentPreviewIndex + 1 < galleryItemsContainer.find('.gallery-item').length) {
            openPreview(currentPreviewIndex + 1);
        }
    }

    function showPrevMedia() {
        if (currentPreviewIndex > 0) {
            openPreview(currentPreviewIndex - 1);
        }
    }

    // Event delegation for dynamically added gallery items
    galleryItemsContainer.on('click', '.gallery-item', function () {
        const clickedIndex = $(this).index();
        openPreview(clickedIndex);
    });

    // Close preview modal
    closePreview.addEventListener("click", closePreviewModal);

    // Navigation in preview modal
    $('#preview-next').on('click', showNextMedia);
    $('#preview-prev').on('click', showPrevMedia);

    // Carousel navigation
    $('.carousel-next').on('click', () => {
        const totalItems = galleryItemsContainer.find('.gallery-item').length;
        currentIndex = (currentIndex + itemsPerSlide < totalItems) ? currentIndex + itemsPerSlide : totalItems - itemsPerSlide;
        updateCarousel();
    });

    $('.carousel-prev').on('click', () => {
        currentIndex = (currentIndex - itemsPerSlide >= 0) ? currentIndex - itemsPerSlide : 0;
        updateCarousel();
    });

    // Delete gallery item
    $('.delete-icon').on('click', function () {
        const galleryItem = $(this).closest('.gallery-item');
        const deleteIndex = galleryItem.index();

        galleryItem.fadeOut(500, function () {
            galleryItem.remove();
            updateCarousel();

            if (deleteIndex === currentPreviewIndex) {
                closePreviewModal();
            } else if (deleteIndex < currentPreviewIndex) {
                currentPreviewIndex--;
            }
        });
    });

    // Initialize carousel
    updateCarousel();
}



//  -----------------
// --- Media library modal ---
// If window.ALWAYS_SELECT is not defined by the HTML, default to false.
if (typeof window.ALWAYS_SELECT === "undefined") {
    window.ALWAYS_SELECT = false;
}

const mainHeader = document.getElementById("fix-header");

let isSelectMode = false; // Only used when ALWAYS_SELECT is false.
let fileInput, uploadArea, fileGrid, tabs, noCardDiv, hasSkeletonLoaded, isFirstRender, showBtnDiv, loadedFiles;

function updateToggleSelectBtn() {
    const selectModeBtn = document.getElementById("toggle-select-mode-btn");
    if (!selectModeBtn) return;
    selectModeBtn.style.display = files.length > 0 ? "block" : "none";

}

function initialiseLibraryModal() {
    fileInput = document.getElementById("fileInput");
    uploadArea = document.getElementById("uploadArea");
    fileGrid = document.querySelector(".file-upload");
    tabs = document.querySelectorAll(".custom-tab");
    noCardDiv = document.getElementById("noCardMessage");
    hasSkeletonLoaded = false;
    isFirstRender = true;
    loadedFiles = [];
    showBtnDiv = document.getElementById("show-btn-div");

    // Click and drop events for the upload area
    uploadArea.addEventListener("click", () => fileInput.click());
    uploadArea.addEventListener("drop", handleDrop);
    fileInput.addEventListener("change", handleFileSelect);
    uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploadArea.classList.add("drag-over");
    });
    uploadArea.addEventListener("dragleave", () => {
        uploadArea.classList.remove("drag-over");
    });



    // Tab switching logic
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
            fileGrid.style.animation = "none";
            fileGrid.offsetHeight; // Trigger reflow for animation restart
            fileGrid.style.animation = "fadeIn 0.3s ease-in-out";
            renderFiles();
        });
    });

    // Wire up the "Enable Select Mode" button (only exists in modal2.html)
    // 1. Detect mobile once (outside the event listener)
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    const selectModeBtn = document.getElementById("toggle-select-mode-btn");
    if (selectModeBtn) {
        selectModeBtn.addEventListener("click", () => {
            isSelectMode = !isSelectMode;
            updateFileUI();

            // 2. Decide button text based on isSelectMode and whether it's mobile
            if (isSelectMode) {
                // On mobile, show "X", otherwise show "Cancel"
                selectModeBtn.innerHTML = isMobile
                    ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.31382 5.90006L10.8488 2.36406C10.9443 2.27182 11.0205 2.16147 11.0729 2.03947C11.1253 1.91746 11.1529 1.78624 11.1541 1.65346C11.1552 1.52069 11.1299 1.38901 11.0796 1.26611C11.0294 1.14321 10.9551 1.03156 10.8612 0.937669C10.7673 0.843776 10.6557 0.769523 10.5328 0.719242C10.4099 0.668961 10.2782 0.643659 10.1454 0.644813C10.0126 0.645967 9.88142 0.673553 9.75942 0.725962C9.63741 0.778371 9.52707 0.854553 9.43482 0.950064L5.89882 4.48506L2.36382 0.950064C2.27157 0.854553 2.16123 0.778371 2.03922 0.725962C1.91722 0.673553 1.786 0.645967 1.65322 0.644813C1.52044 0.643659 1.38876 0.668961 1.26587 0.719242C1.14297 0.769523 1.03132 0.843776 0.937425 0.937669C0.843532 1.03156 0.769279 1.14321 0.718998 1.26611C0.668717 1.38901 0.643415 1.52069 0.644569 1.65346C0.645723 1.78624 0.673309 1.91746 0.725718 2.03947C0.778127 2.16147 0.854309 2.27182 0.949819 2.36406L4.48482 5.89906L0.949819 9.43506C0.854309 9.52731 0.778127 9.63766 0.725718 9.75966C0.673309 9.88166 0.645723 10.0129 0.644569 10.1457C0.643415 10.2784 0.668717 10.4101 0.718998 10.533C0.769279 10.6559 0.843532 10.7676 0.937425 10.8615C1.03132 10.9554 1.14297 11.0296 1.26587 11.0799C1.38876 11.1302 1.52044 11.1555 1.65322 11.1543C1.786 11.1532 1.91722 11.1256 2.03922 11.0732C2.16123 11.0208 2.27157 10.9446 2.36382 10.8491L5.89882 7.31406L9.43482 10.8491C9.52707 10.9446 9.63741 11.0208 9.75942 11.0732C9.88142 11.1256 10.0126 11.1532 10.1454 11.1543C10.2782 11.1555 10.4099 11.1302 10.5328 11.0799C10.6557 11.0296 10.7673 10.9554 10.8612 10.8615C10.9551 10.7676 11.0294 10.6559 11.0796 10.533C11.1299 10.4101 11.1552 10.2784 11.1541 10.1457C11.1529 10.0129 11.1253 9.88166 11.0729 9.75966C11.0205 9.63766 10.9443 9.52731 10.8488 9.43506L7.31382 5.90006Z" fill="white"/>
  </svg>
  `
                    : "Cancel";


                if (isMobile) {
                    // Mobile-specific colors
                    selectModeBtn.style.backgroundColor = "#6C757D"; // Replace with your desired mobile color
                    selectModeBtn.style.color = "#FFFFFF"; // Mobile text color
                    selectModeBtn.style.boxShadow = "0 4px 4px 0 rgba(0, 0, 0, 0.1)"
                    selectModeBtn.style.border = "none";
                    selectModeBtn.style.padding = "5px 13p";
                    selectModeBtn.style.borderRadius = "6px"
                } else {
                    // Desktop or default colors
                    selectModeBtn.style.backgroundColor = "#E9ECEF";
                    selectModeBtn.style.color = "black";
                    selectModeBtn.style.border = "1px solid #E4E0E0";


                }

                selectModeBtn.style.border = "none";
            } else {
                // When not in select mode, show "Select"
                selectModeBtn.textContent = "Select";
                selectModeBtn.style.backgroundColor = ""; // revert to default
                selectModeBtn.style.color = "";
            }
        });
    }



    // Optional: Additional controls for select mode
    const selectAllBtn = document.getElementById("select-all-btn");
    if (selectAllBtn) {
        selectAllBtn.addEventListener("click", () => {
            if (!isSelectMode) return;
            files.forEach(file => file.selected = true);
            updateFileUI();
        });
    }
    const deselectAllBtn = document.getElementById("deselect-all-btn");
    if (deselectAllBtn) {
        deselectAllBtn.addEventListener("click", () => {
            if (!isSelectMode) return;
            files.forEach(file => file.selected = false);
            updateFileUI();
        });
    }

}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove("drag-over");
    handleFiles(e.dataTransfer.files);
}

function handleFileSelect(e) {
    handleFiles(e.target.files);
}

function handleFiles(fileList) {
    for (let file of fileList) {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            files.unshift({
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                file: file,
                type: file.type.startsWith("image/") ? "image" : "video",
                url: URL.createObjectURL(file),
                status: "success",
                selected: false,
            });
        }
    }
    renderFiles();
    updateToggleSelectBtn(); // Update button visibility after adding files

}

function updateShowMoreButton(filteredFiles, fileElements) {
    const existingShowMoreBtn = showBtnDiv.querySelector(".show-more-btn");
    if (existingShowMoreBtn) {
        existingShowMoreBtn.remove();
    }
    let currentIndex = 24;
    fileGrid.innerHTML = "";
    fileGrid.appendChild(uploadArea);
    fileElements.slice(0, currentIndex).forEach(element => fileGrid.appendChild(element));
    if (filteredFiles.length > currentIndex) {
        const showMoreButton = document.createElement("button");
        showMoreButton.textContent = "Show More";
        showMoreButton.classList.add("btn", "border-btn", "show-more-btn");
        showMoreButton.addEventListener("click", () => {
            const nextBatch = fileElements.slice(currentIndex, currentIndex + 24);
            nextBatch.forEach(element => {
                element.style.display = "block";
                fileGrid.appendChild(element);
            });
            currentIndex += 24;
            if (currentIndex >= filteredFiles.length) {
                showMoreButton.style.display = "none";
            }
        });
        showBtnDiv.appendChild(showMoreButton);
    }
}

function renderFiles() {
    const activeTab = document.querySelector(".custom-tab.active").dataset.tab;
    const file__ = document.getElementById("file-upload");
    fileGrid.innerHTML = "";
    fileGrid.appendChild(uploadArea);
    file__.classList.add("file-grid");
    if (!file__) return;
    if (files.length === 0) {
        file__.classList.remove("file-grid");
        document.getElementById("custom-tabs").style.display = "none";
        document.getElementById("upload-icon").style.display = "block";
        document.getElementById("static-upload").style.display = "block";
        document.getElementById("static-upload-show").style.display = "none";
        return;
    } else {
        file__.classList.add("file-grid");
    }
    const filteredFiles = files.filter((file) => {
        if (activeTab === "all") return true;
        if (activeTab === "photos") return file.type === "image";
        if (activeTab === "videos") return file.type === "video";
        if (activeTab === "selected") return file.selected === true;
        return false;
    });

    // Manage UI in "selected" tab
    if (activeTab === "selected") {
        noCardDiv.style.display = filteredFiles.length === 0 ? "block" : "none";
        uploadArea.style.display = "none";
    } else {
        noCardDiv.style.display = "none";
        uploadArea.style.display = "block";
    }

    const fileElements = filteredFiles.map((file) => {
        const tabsAll = document.getElementById("custom-tabs");
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";
        fileItem.dataset.fileId = file.id;
        fileItem.id = "file-itemBg";
        tabsAll.style.display = "block";

        document.getElementById("upload-icon").style.display = "none";
        document.getElementById("static-upload").style.display = "none";
        document.getElementById("static-upload-show").style.display = "block";

        if (file.selected) fileItem.classList.add("selected");

        if (isFirstRender || file.isPreloaded) {
            appendFileContent(fileItem, file);
        } else {
            showLoadingSpinner(fileItem, file);
        }

        // When a file item is clicked:
        // When a file item is clicked:
        fileItem.addEventListener("click", (e) => {
            // Ignore clicks on menu options.
            if (e.target.closest(".menu-option") || e.target.closest(".dots-menu")) return;

            // Only allow gallery preview if the file has finished loading (skeleton removed).
            if (!file.isRendered) {
                // Optionally, show a warning toast:
                // openToast("warning", "", "File is still loading. Please wait.", "toast-container");
                return;
            }

            if (window.ALWAYS_SELECT) {
                // For modal1, always toggle selection.
                toggleFileSelection(file);
                updateFileUI();
            } else {
                // For modal2:
                if (isSelectMode) {
                    // Toggle selection when select mode is on.
                    toggleFileSelection(file);
                    updateFileUI();
                } else {
                    // When select mode is off, open the gallery.
                    const fileIndex = files.indexOf(file);
                    openGallery(fileIndex);
                }
            }
        });






        return fileItem;
    });

    fileGrid.innerHTML = "";
    fileGrid.appendChild(uploadArea);
    fileElements.forEach(element => fileGrid.appendChild(element));
    updateShowMoreButton(filteredFiles, fileElements);
    updateToggleSelectBtn();

    isFirstRender = false;
}

function toggleFileSelection(file) {
    file.selected = !file.selected;
    updateFileUI();
}

function updateFileUI() {
    let anySelected = false;

    // Only for modal2: when select mode is off and ALWAYS_SELECT is false, deselect all files
    if (!isSelectMode && !window.ALWAYS_SELECT) {
        files.forEach(file => file.selected = false);
    }

    files.forEach(file => {
        const fileItem = document.querySelector(`[data-file-id="${file.id}"]`);
        if (fileItem) {
            fileItem.classList.toggle("selected", file.selected);
            if (file.selected) {
                anySelected = true;
            }
        }
    });

    updateSelectionControls(anySelected);
}



function updateSelectionControls(anySelected) {
    const selectionControls = document.getElementById("selection-controls");
    if (!selectionControls) return;

    // If select mode is off, hide the entire control container.
    if (!isSelectMode) {
        selectionControls.style.display = "none";
    } else {
        // When select mode is on, always show the controls container.
        selectionControls.style.display = "flex";
        selectionControls.style.boxShadow = "0 4px 4px 0 rgba(0, 0, 0, 0.1)"

        // If no file is selected, only show the "Select All" button.
        if (!anySelected) {
            document.getElementById("select-all-btn").style.display = "block";
            document.getElementById("deselect-all-btn").style.display = "none";
            document.getElementById("delete-selected-btn").style.display = "none";
        } else {
            // If one or more files are selected, show all control buttons.
            document.getElementById("select-all-btn").style.display = "block";
            document.getElementById("deselect-all-btn").style.display = "block";
            document.getElementById("delete-selected-btn").style.display = "block";
        }
    }
}
/* ---------------------------
   The remaining functions below (appendFileContent, showSkeleton, appendMedia,
   appendMenuOptions, showLoadingSpinner, openToast, closeToast, openPreview, etc.)
   remain largely the same as in your original script.js file.
----------------------------- */

function appendFileContent(fileItem, file) {
    if (!file.isRendered) {
        showSkeleton(fileItem, file);
        return;
    }
    if (!hasSkeletonLoaded) {
        showSkeleton(fileItem, file);
        hasSkeletonLoaded = true;
        return;
    }
    appendMedia(fileItem, file);
}

function showSkeleton(fileItem, file) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-loader");
    fileItem.appendChild(skeleton);
    setTimeout(() => {
        skeleton.remove();
        appendMedia(fileItem, file);
        file.isRendered = true;
    }, 2000);
}

let mediaElement;
function appendMedia(fileItem, file) {
    if (file.type === "image") {
        mediaElement = document.createElement("img");
        mediaElement.src = file.url;
        mediaElement.alt = "Uploaded file";
        mediaElement.id = "croppedImage";
        mediaElement.className = "uploadImg";
    } else if (file.type === "video") {
        mediaElement = document.createElement("video");
        mediaElement.src = file.url;
        mediaElement.className = "videoUpload";
        mediaElement.controls = false;
        mediaElement.pause();
        const playIcon = document.createElement("div");
        playIcon.className = "play-icon";
        playIcon.innerHTML = `<svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <polygon points="6,4 20,12 6,20"/></svg>`;
        fileItem.appendChild(mediaElement);
        fileItem.appendChild(playIcon);
    }
    if (mediaElement) {
        fileItem.appendChild(mediaElement);
    }
    fileItem.classList.remove("loading");
    file.isPreloaded = true;

    // Reattach selection click handler (if needed)
    // fileItem.addEventListener("click", () => toggleFileSelection(file));

    appendMenuOptions(fileItem, file);
}

function appendMenuOptions(fileItem, file) {
    const dotsMenudiv = document.createElement("div");
    dotsMenudiv.className = "dots-menuDiv";
    const dotsMenu = document.createElement("div");
    dotsMenu.className = "dots-menu";
    dotsMenu.innerHTML = "<img src='images/icons/menu-kebab-horizontal.svg' /> ";
    dotsMenu.style.display = "none";
    const menuOptions = document.createElement("div");
    menuOptions.className = "menu-options";
    if (file.type === "video") {
        const videoMenu = document.getElementById('videoMenu');
        menuOptions.innerHTML = videoMenu.innerHTML;
    } else if (file.type === "image") {
        const imageMenu = document.getElementById('imageMenu');
        menuOptions.innerHTML = imageMenu.innerHTML;
    }
    menuOptions.style.display = "none";

    fileItem.appendChild(dotsMenudiv);
    dotsMenudiv.appendChild(dotsMenu);
    dotsMenudiv.appendChild(menuOptions);

    dotsMenu.addEventListener("click", (e) => {
        menuOptions.style.display = menuOptions.style.display === "none" ? "block" : "none";
        e.stopPropagation();
    });
    fileItem.addEventListener("mouseleave", () => menuOptions.style.display = "none");
    fileItem.addEventListener("click", () => {
        menuOptions.style.display = "none";
    });
    menuOptions.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = e.target.closest(".menu-option")?.dataset.action;
        if (action === "preview" && file.type === "image") {
            // In modal.html, window.ALWAYS_SELECT is true so we use openPreview.
            // In modal2 (without ALWAYS_SELECT), we call openGallery using the file's index.
            if (window.ALWAYS_SELECT) {
                openPreview(file);
            } else {
                let index = files.indexOf(file);
                openGallery(index);
            }
        } else if (action === "crop" && file.type === "image") {
            cropImage(file);
        } else if (action === "play" && file.type === "video") {
            // openPreview(file);


            if (window.ALWAYS_SELECT) {
                openPreview(file);
            } else {
                let index = files.indexOf(file);
                openGallery(index);
            }
        } else if (action === "download") {
            downloadFile(file);
        } else if (action === "delete") {
            deleteFile(file);
        }
        menuOptions.style.display = "none";
    });
    fileItem.addEventListener("mouseenter", () => {
        dotsMenu.style.display = "block";
    });
    fileItem.addEventListener("mouseleave", () => {
        if (window.innerWidth > 768) {
            dotsMenu.style.display = "none";
        }
    });
    if (window.matchMedia("(max-width: 768px)").matches) {
        dotsMenu.style.display = "block";
    } else {
        dotsMenu.style.display = "none";
    }
}

function showLoadingSpinner(fileItem, file) {
    fileItem.classList.add("loading");
    const parentloadingIndicator = document.createElement("div");
    parentloadingIndicator.className = "parentloading-indicator";

    const loadingIndicator = document.createElement("div");
    loadingIndicator.className = "loading-indicator";

    // Add loadingIndicator inside parentloadingIndicator
    parentloadingIndicator.appendChild(loadingIndicator);
    // ***NEW: Allow clicks to pass through***
    loadingIndicator.style.pointerEvents = "none";

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "80");
    svg.setAttribute("height", "80");
    svg.setAttribute("viewBox", "0 0 100 100");
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const bgCircle = document.createElementNS(svgNS, "circle");
    bgCircle.setAttribute("cx", "50");
    bgCircle.setAttribute("cy", "50");
    bgCircle.setAttribute("r", radius);
    bgCircle.setAttribute("stroke", "#ddd");
    bgCircle.setAttribute("stroke-width", "8");
    bgCircle.setAttribute("fill", "none");
    const progressCircle = document.createElementNS(svgNS, "circle");
    progressCircle.setAttribute("cx", "50");
    progressCircle.setAttribute("cy", "50");
    progressCircle.setAttribute("r", radius);
    progressCircle.setAttribute("stroke", "#2E5DC0");
    progressCircle.setAttribute("stroke-width", "8");
    progressCircle.setAttribute("fill", "none");
    progressCircle.setAttribute("stroke-linecap", "round");
    progressCircle.setAttribute("stroke-dasharray", circumference);
    progressCircle.setAttribute("stroke-dashoffset", circumference);
    progressCircle.style.transform = "rotate(-90deg)";
    progressCircle.style.transformOrigin = "50px 50px";
    const percentageText = document.createElement("div");
    percentageText.className = "percentage-text";
    percentageText.innerText = "0%";
    svg.appendChild(bgCircle);
    svg.appendChild(progressCircle);
    loadingIndicator.appendChild(svg);
    loadingIndicator.appendChild(percentageText);
    fileItem.appendChild(parentloadingIndicator);
    let progressValue = 0;
    const loadingInterval = setInterval(() => {
        if (progressValue < 100) {
            progressValue += 2;
            const offset = circumference - (progressValue / 100) * circumference;
            progressCircle.setAttribute("stroke-dashoffset", offset);
            percentageText.innerText = `${progressValue}%`;
        } else {
            clearInterval(loadingInterval);
            fileItem.classList.remove("loading");
            loadingIndicator.style.display = "none";
            appendFileContent(fileItem, file);
        }
    }, 100);
}



function openPreview(file) {
    const previewModal = document.getElementById("previewModal");
    const modalContentMain = document.getElementById("modelContStart");
    previewModal.style.display = "block";
    modalContentMain.innerHTML = "";
    if (file.type === "image") {
        const img = document.createElement("img");
        img.src = file.url;
        img.alt = "Preview";
        img.className = "preview-image";
        modalContentMain.appendChild(img);
    } else if (file.type === "video") {
        let video = document.createElement("video");
        video.src = file.url;
        video.controls = true;
        video.autoplay = true;
        video.className = "preview-video";
        modalContentMain.appendChild(video);
    }
}

function closePreviewModal() {
    const previewModal = document.getElementById("previewModal");
    const video = document.querySelector(".preview-video");
    if (!previewModal) return;
    previewModal.style.display = "none";
    if (video) {
        video.pause();
        video.currentTime = 0;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const backCloseBtn = document.getElementById("back-closeModal");
    const closeModalBtn = document.getElementById("close-modal");
    if (backCloseBtn) {
        backCloseBtn.addEventListener("click", closePreviewModal);
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closePreviewModal);
    }
});

window.addEventListener("message", (event) => {
    if (event.data.action === "updateCroppedImage") {
        const { fileId, croppedImageData } = event.data;
        const file = files.find((f) => f.id === fileId);
        if (file) {
            file.url = croppedImageData;
            renderFiles();
            const previewWindow = window.open("", "preview");
            if (previewWindow && !previewWindow.closed) {
                const previewImage = previewWindow.document.getElementById("croppedImage");
                if (previewImage) {
                    previewImage.src = croppedImageData;
                }
            }
        }
    }
});

function cropImage(file) {
    const previewModal = document.getElementById("previewModal");
    const modalContentMain = document.getElementById("modelContStart");
    previewModal.style.display = "block";
    modalContentMain.innerHTML = `
    <div><img id="cropImage" src="${file.url}" class="preview-image" />
           <div id="cropBtn">
               <button class="crop-cancel" id="crop-cancel">Cancel</button>
               <button id="cropConfirm">Done</button>
           </div></div>`;
    const image = document.getElementById("cropImage");
    image.onload = function () {
        const cropper = new Cropper(image, {
            viewMode: 1,
            autoCropArea: 0.8,
            movable: true,
            zoomable: true,
            scalable: true,
            cropBoxResizable: true,
            dragMode: "move",
            aspectRatio: NaN,
        });
        document.getElementById("cropConfirm").addEventListener("click", () => {
            const croppedImageData = cropper.getCroppedCanvas().toDataURL();
            file.url = croppedImageData;
            previewModal.style.display = "none";
            renderFiles();
        });
        document.getElementById("crop-cancel").addEventListener("click", () => {
            previewModal.style.display = "none";
        });
    };
}

function downloadFile(file) {
    const a = document.createElement("a");
    if (file.url.startsWith("http")) {
        fetch(file.url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                a.href = blobUrl;
                a.download = file.file?.name || "downloaded-image.jpg";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);
            })
            .catch(error => console.error("Image download failed:", error));
    } else {
        a.href = file.url;
        a.download = file.file?.name || "downloaded-image.jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}

function deleteFile(file) {
    files = files.filter((f) => f.id !== file.id);
    renderFiles();
    updateToggleSelectBtn();
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>Preview Modal gallery <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// Global variable for the current image index in the gallery.'
function createGalleryGrid(files) {
    let mediaFiles = files;
    const galleryGrid = document.getElementById("galleryGrid"); // Ensure there's a container with this ID
    galleryGrid.innerHTML = ""; // Clear existing content

    mediaFiles.forEach((file, index) => {
        const item = document.createElement("div");
        item.classList.add("file-item");

        if (file.type === "image") {
            // Create an image element for images
            const img = document.createElement("img");
            img.src = file.url;
            img.alt = `Image ${index + 1}`;
            img.addEventListener("click", () => openGallery(index, mediaFiles)); // ✅ Click Event
            item.appendChild(img);
        } else if (file.type === "video") {
            // Create a video wrapper for videos
            const videoWrapper = document.createElement("div");
            videoWrapper.classList.add("video-wrapper");

            // Click anywhere in the wrapper should open the gallery
            videoWrapper.addEventListener("click", () => openGallery(index, mediaFiles)); // ✅ Fix Here

            const video = document.createElement("video");
            video.src = file.url;
            video.setAttribute("preload", "metadata");

            // Play button overlay
            const playButton = document.createElement("div");
            playButton.classList.add("play-button");
            playButton.innerHTML = "▶"; // Play icon

            videoWrapper.appendChild(video);
            videoWrapper.appendChild(playButton);
            item.appendChild(videoWrapper);
        }

        galleryGrid.appendChild(item);
    });
}
document.addEventListener("DOMContentLoaded", function () {

    // Get references to zoom and download buttons
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const fullscreenBtn = document.getElementById("fullscreenBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const closeGallery = document.getElementById("closeGallery");
    const mainGalleryMedia = document.getElementById("mainGalleryMedia");

    // Ensure elements exist before adding event listeners
    if (zoomInBtn && zoomOutBtn && fullscreenBtn && downloadBtn && closeGallery) {
        zoomInBtn.addEventListener("click", zoomIn);
        zoomOutBtn.addEventListener("click", zoomOut);
        fullscreenBtn.addEventListener("click", fullScreen);
        downloadBtn.addEventListener("click", downloadPreview);
        closeGallery.addEventListener("click", closeGalleryView);
    }

    // Set transition for smooth zoom effects
    if (mainGalleryMedia) {
        mainGalleryMedia.style.transition = "transform 0.4s ease-in-out";
    }

    // Zoom In Function
    function zoomIn() {
        if (window.innerWidth <= 768) {
            // Enable fullscreen mode for mobile
            mainGalleryMedia.style.position = "fixed";
            mainGalleryMedia.style.top = "0";
            mainGalleryMedia.style.left = "0";
            mainGalleryMedia.style.width = "100vw";
            mainGalleryMedia.style.height = "100vh";
            mainGalleryMedia.style.objectFit = "contain"; // Show full image
            mainGalleryMedia.style.background = "#000";

            // Show control buttons in fullscreen mode
            document.querySelector(".controls").classList.add("show-controls");

            // Add event listener to reset zoom when clicking the image
            mainGalleryMedia.addEventListener("click", zoomOut);
        } else {
            // Normal zoom effect on desktop
            mainGalleryMedia.style.transform = "scale(3)";
        }

        isZoomed = true;
        zoomInBtn.style.display = "none";
        zoomOutBtn.style.display = "flex";
    }

    function zoomOut() {
        const mainGalleryMedia = document.getElementById("mainGalleryMedia");

        if (!mainGalleryMedia) {
            console.error("zoomOut: mainGalleryMedia element not found.");
            return; // Stop function execution if element is missing
        }

        if (window.innerWidth <= 768) {
            // Exit fullscreen mode for mobile
            mainGalleryMedia.style.position = "";
            mainGalleryMedia.style.top = "";
            mainGalleryMedia.style.left = "";
            mainGalleryMedia.style.width = "";
            mainGalleryMedia.style.height = "";
            mainGalleryMedia.style.objectFit = "";
            mainGalleryMedia.style.zIndex = "";
            mainGalleryMedia.style.background = "";

            // Hide control buttons when exiting fullscreen
            const controls = document.querySelector(".controls");
            if (controls) {
                controls.classList.remove("show-controls");
            }

            // Remove event listener after zooming out
            mainGalleryMedia.removeEventListener("click", zoomOut);
        } else {
            // Reset zoom effect on desktop
            mainGalleryMedia.style.transform = "scale(1)";
        }

        isZoomed = false;

        // Ensure buttons exist before modifying display
        const zoomInBtn = document.getElementById("zoomInBtn");
        const zoomOutBtn = document.getElementById("zoomOutBtn");

        if (zoomInBtn) zoomInBtn.style.display = "flex";
        if (zoomOutBtn) zoomOutBtn.style.display = "none";
    }

    // Fullscreen Toggle Function
    function fullScreen() {
        const galleryView = document.getElementById("galleryView");
        if (!galleryView) return;

        if (!document.fullscreenElement) {
            galleryView.requestFullscreen().catch(err => {
                console.error("Fullscreen request failed:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Download Image Function (Fix)
    function downloadPreview() {
        const mainGalleryMedia = document.getElementById("mainGalleryMedia");

        if (!mainGalleryMedia) {
            alert("Not available to download!");
            return;
        }

        // ✅ Check if the displayed media is an image or video
        const imageElement = mainGalleryMedia.querySelector("img");
        const videoElement = mainGalleryMedia.querySelector("video");

        let mediaUrl = "";
        let fileName = "downloaded-file"; // Default filename

        if (imageElement) {
            // ✅ Handle Image Download
            mediaUrl = imageElement.src;
            fileName = mediaUrl.split("/").pop().split("?")[0] || "downloaded-image.jpg";
        } else if (videoElement) {
            // ✅ Handle Video Download
            mediaUrl = videoElement.src;
            fileName = mediaUrl.split("/").pop().split("?")[0] || "downloaded-video.mp4";
        } else {
            alert("No media available to download!");
            return;
        }

        // ✅ Fetch the media file and trigger download
        fetch(mediaUrl)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); // Cleanup
            })
            .catch(error => console.error("Download failed:", error));
    }

    // Close Gallery Function
    function closeGalleryView() {
        const galleryView = document.getElementById("galleryView");
        if (!galleryView) return;

        if (document.fullscreenElement) {
            document.exitFullscreen().then(() => hideGallery());
        } else {
            hideGallery();
        }
        if (mainHeader) {
            mainHeader.style.display = "block"

        }
        const previewModal = document.getElementById("previewModal");
        const video = document.querySelector("#mainGalleryMedia video"); // Select video inside gallery

        if (!previewModal) return;

        previewModal.style.display = "none";

        // Stop video playback if it's playing
        if (video) {
            video.pause();      // Pause the video
            video.currentTime = 0;  // Reset to the beginning
            video.src = "";     // Remove source to stop buffering
            video.load();       // Reload the video element
        }
    }

    function hideGallery() {
        const galleryView = document.getElementById("galleryView");
        if (!galleryView) return;

        galleryView.classList.remove("show");
        setTimeout(() => {
            galleryView.style.display = "none";
            document.body.style.overflow = ""; // Enable scrolling again
            zoomOut(); // Reset zoom when closing
        }, 400); // Match the CSS transition duration
    }
});


let isTransitioning = false; // Prevent multiple quick clicks
function navigateGallery(direction, files = window.files) {
    const mediafiles = files;
    if (isTransitioning) return; // Prevent spam clicking
    isTransitioning = true;

    const mainGalleryMedia = document.getElementById("mainGalleryMedia");
    mainGalleryMedia.style.opacity = "0"; // Fade-out effect

    setTimeout(() => {
        let newIndex = currentGalleryIndex + direction;
        showGalleryImage(newIndex, mediafiles);  // Update the image
        mainGalleryMedia.style.opacity = "1"; // Fade-in effect
        isTransitioning = false;
    }, 300); // Wait for transition to complete
}

let touchStartX = 0;
let touchEndX = 0;
let isSwiping = false; // Track if user is swiping

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    isSwiping = false; // Reset swipe tracking
}

function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;

    // ✅ Start tracking only if swipe distance is significant
    if (Math.abs(swipeDistance) > 10) {
        isSwiping = true;
    }
}

function handleTouchEnd(event, files = window.files) {
    const mainGalleryMedia = document.getElementById("mainGalleryMedia");
    const swipeDistance = touchStartX - touchEndX;

    if (!isSwiping) return; // Ignore if not a swipe

    // Allow swiping even if the touch event started on a video element
    if (swipeDistance > 50) {
        // Swipe Left → Next Image
        mainGalleryMedia.style.transition = "transform 0.3s ease-in-out";
        mainGalleryMedia.style.transform = "translateX(-100%)";

        setTimeout(() => {
            mainGalleryMedia.style.transform = "translateX(0)";
            navigateGallery(1, files);
        }, 300);
    } else if (swipeDistance < -50) {
        // Swipe Right → Previous Image
        mainGalleryMedia.style.transition = "transform 0.3s ease-in-out";
        mainGalleryMedia.style.transform = "translateX(100%)";

        setTimeout(() => {
            mainGalleryMedia.style.transform = "translateX(0)";
            navigateGallery(-1, files);
        }, 300);
    }
}

// Wrapper function to pass custom files array to handleTouchEnd
function createTouchEndHandler(files) {
    return function (event) {
        handleTouchEnd(event, files); // Pass the custom files array
    };
}

// Set up event listeners with custom files array
function setupGalleryEventListeners(files = window.files) {
    const galleryContainer = document.getElementById("mainGalleryMedia");
    if (galleryContainer) {
        galleryContainer.addEventListener("touchstart", handleTouchStart);
        galleryContainer.addEventListener("touchmove", handleTouchMove);
        galleryContainer.addEventListener("touchend", createTouchEndHandler(files)); // Use custom files array
    }
}



let currentGalleryIndex = 0;

// Helper to extract image URLs from the global files array.
// Extract both image and video URLs from the global files array.
function getGalleryMediaFromFiles(files = window.files) {
    return files.map(file => ({ url: file.url, type: file.type }));
}


// Opens the gallery preview modal using images from the files array.
function openGallery(index, files = window.files) {

    const galleryView = document.getElementById("galleryView");
    if (!galleryView) {
        console.error("Gallery view element not found.");
        return;
    }

    document.body.style.overflow = "hidden"; // Disable background scrolling
    galleryView.style.display = "block";

    setTimeout(() => {
        galleryView.classList.add("show"); // Fade-in animation
    }, 10);

    currentGalleryIndex = index;
    showGalleryImage(currentGalleryIndex, files);
    createGalleryThumbnails(files);
    resetZoom();
    if (mainHeader) {
        // Hide header when gallery opens
        mainHeader.style.display = "none";
    }


    // Enable swipe gestures for navigation (for mobile)
    const mainGalleryMedia = document.getElementById("mainGalleryMedia");
    if (mainGalleryMedia) {
        mainGalleryMedia.addEventListener("touchstart", handleTouchStart);
        mainGalleryMedia.addEventListener("touchmove", handleTouchMove);
        mainGalleryMedia.addEventListener("touchend", handleTouchEnd);
        mainGalleryMedia.addEventListener("touchend", (event) => handleTouchEnd(event, files));
    }
}
let video;

// Displays the selected image in the main preview area.
function showGalleryImage(index, files = window.files) {
    let mediaFilesdata = files;
    const mediaFiles = getGalleryMediaFromFiles(mediaFilesdata);
    if (mediaFiles.length === 0) return;

    if (index < 0) index = mediaFiles.length - 1;
    if (index >= mediaFiles.length) index = 0;
    currentGalleryIndex = index;

    const mainGalleryMedia = document.getElementById("mainGalleryMedia");
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");

    if (!mainGalleryMedia) {
        console.error("showGalleryImage: mainGalleryMedia element not found.");
        return;
    }

    // Clear previous content
    mainGalleryMedia.innerHTML = "";

    const media = mediaFiles[index];

    if (media.type === "image") {
        // Show Image & Enable Zoom Buttons
        const img = document.createElement("img");
        img.src = media.url;
        img.className = "gallery-media";
        img.alt = "Gallery Image";
        mainGalleryMedia.appendChild(img);

        // Ensure zoom buttons are visible for images
        if (zoomInBtn) zoomInBtn.style.display = "flex";
        if (zoomOutBtn) zoomOutBtn.style.display = "none";
    } else if (media.type === "video") {
        // Show Video & Force Hide Zoom Buttons
        video = document.createElement("video");
        video.src = media.url;
        video.className = "gallery-media";
        video.controls = true;
        video.autoplay = true;
        video.muted = true;
        video.setAttribute("muted", "true");
        mainGalleryMedia.appendChild(video);

        // Force Hide Zoom Buttons for Videos
        if (zoomInBtn) zoomInBtn.style.display = "none !important";
        if (zoomOutBtn) zoomOutBtn.style.display = "none !important";
    }

    updateGalleryThumbnails(files);
    updateGalleryCounter(files);
    scrollActiveThumbnailIntoView();
}


// Creates thumbnails based on the files array.
function createGalleryThumbnails(files = window.files) {
    const mediaFilesdata = files;
    const mediaFiles = getGalleryMediaFromFiles(mediaFilesdata); // ✅ Fetch both images & videos
    const thumbnailGallery = document.getElementById("thumbnailGallery");

    if (!thumbnailGallery) return;

    thumbnailGallery.innerHTML = ""; // Clear existing thumbnails

    mediaFiles.forEach((media, index) => {
        const thumbContainer = document.createElement("div");
        thumbContainer.classList.add("thumbnail-parent");

        let thumb;

        if (media.type === "image") {
            // ✅ Create Image Thumbnail
            thumb = document.createElement("img");
            thumb.src = media.url;
            thumb.classList.add("thumbnail");
        } else if (media.type === "video") {
            // ✅ Create Video Thumbnail
            thumb = document.createElement("video");
            thumb.src = media.url;
            thumb.classList.add("thumbnail");
            thumb.muted = true;
            thumb.playsInline = true;
            thumb.preload = "metadata"; // Load metadata, not the whole video

            // ✅ Add Play Button Overlay for Videos
            const playIcon = document.createElement("div");
            playIcon.classList.add("play-icon");
            playIcon.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <polygon points="6,4 20,12 6,20"/>
                </svg>
            `;
            thumbContainer.appendChild(playIcon); // Append play icon to the thumbnail container
        }

        if (index === currentGalleryIndex) {
            thumb.classList.add("active");
        }

        // ✅ Click Event to Show Image or Video in Gallery
        thumb.addEventListener("click", () => showGalleryImage(index, files));

        thumbContainer.appendChild(thumb);
        thumbnailGallery.appendChild(thumbContainer);
    });
}

// Updates which thumbnail is marked as active.
function updateGalleryThumbnails() {
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumb, index) => {
        if (index === currentGalleryIndex) {
            thumb.classList.add("active");
        } else {
            thumb.classList.remove("active");
        }
    });
}

// Updates the counter display showing the current image index.
function updateGalleryCounter(files = window.files) {
    const mediaFilesData = files;
    const mediaFiles = getGalleryMediaFromFiles(mediaFilesData); // ✅ Use Correct Function
    const counter = document.querySelector(".counter");

    if (counter) {
        counter.textContent = `${currentGalleryIndex + 1} / ${mediaFiles.length}`;
    }
}

// Scrolls the active thumbnail into view.
function scrollActiveThumbnailIntoView() {
    const activeThumbnail = document.querySelector(".thumbnail.active");
    if (activeThumbnail) {
        activeThumbnail.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest"
        });
    }
}

// Resets any zoom on the main gallery image.
function resetZoom() {
    const mainGalleryMedia = document.getElementById("mainGalleryMedia");
    if (mainGalleryMedia) {
        mainGalleryMedia.style.transform = "scale(1)";
    }
    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    if (zoomInBtn && zoomOutBtn) {
        zoomInBtn.style.display = "flex";
        zoomOutBtn.style.display = "none";
    }
}


// Function to close the error popup
function closeErrorPopup() {
    const deleteErrorPopup = document.getElementById("deleteErrorPopup");
    if (deleteErrorPopup) {
        deleteErrorPopup.style.display = "none";
    }
}

// Function to retry the error action 
function retryErrorPopup() {
    const deleteErrorPopup = document.getElementById("deleteErrorPopup");
    if (deleteErrorPopup) {
        deleteErrorPopup.style.display = "none";
    }
    // Add retry logic here
    try {
        const selectedFiles = files.filter(file => file.selected);
        if (selectedFiles.length === 0) {
            openToast("warning", "", "No files selected to delete.", "toast-container");
            return;
        }

        // Delete selected files
        files = files.filter(file => !file.selected);

        // Turn off select mode automatically after deletion
        isSelectMode = false;
        updateFileUI();
        renderFiles();

        // Update the toggle button text and style back to "Select"
        const selectModeBtn = document.getElementById("toggle-select-mode-btn");
        if (selectModeBtn) {
            selectModeBtn.textContent = "Select";
            selectModeBtn.style.backgroundColor = "";
            selectModeBtn.style.color = "";
            selectModeBtn.style.border = "";
        }

        // Show success popup (or toast) and hide the confirmation popup
        openToast("success", "", "Selected files have been deleted successfully.", "toast-container");
        deleteConfirmPopup.style.display = "none";
    } catch (error) {
        // Handle error if retry fails
        openToast("error", "", "Failed to retry deletion. Please try again.", "toast-container");
    }
}


// ---------------

/**
 * Applies a mask to the specified input field to ensure proper formatting for dates.
 * @param {string} inputSelector - The selector for the input field to apply the mask to.
 * @param {string} maskFormat - The mask format to apply to the input field.
 */
function applyDateMask(inputSelector, maskFormat) {
    $(inputSelector).mask(maskFormat, { placeholder: "dd / mm / yyyy" });
}

// --------------
/**
 * Search Component - A reusable search utility for dynamic data
 * 
 * Options:
 * - searchContainer: Selector for the search container (default '.adi-search-container')
 * - inputSelector: Selector for the input element (default '.search-input')
 * - clearSelector: Selector for the clear button (default '.search-clear')
 * - highlightClass: Class to apply to highlights (default 'search-highlight')
 * - data: Array of objects to search through (required)
 * - renderResults: Function that renders filtered data (required)
 */
const SearchComponent = (function () {
    // Default configuration
    const defaults = {
        searchContainer: '.adi-search-container',
        inputSelector: '.search-input',
        clearSelector: '.search-clear',
        highlightClass: 'search-highlight',
        data: [],
        onDataFiltered: null, // Callback to update paginator with filtered data
    };

    // Current state
    let currentSearchTerm = '';
    let config = {};

    // Initialize the search component
    function init(options = {}) {
        config = { ...defaults, ...options };

        // Validate required options
        if (!Array.isArray(config.data)) {
            console.error('SearchComponent: "data" must be an array');
            return;
        }

        // if (typeof config.onDataFiltered !== 'function') {
        //     console.error('SearchComponent: "renderResults" must be a function');
        //     return;
        // }

        // Get DOM elements
        const searchContainer = document.querySelector(config.searchContainer);
        if (!searchContainer) return;

        const searchInput = searchContainer.querySelector(config.inputSelector);
        const clearButton = searchContainer.querySelector(config.clearSelector);

        if (!searchInput) return;

        // Initial render
        config.onDataFiltered(config.data);

        // Event listeners
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value.trim();
            updateClearButton(clearButton, currentSearchTerm);
            performSearch();
        });

        if (clearButton) {
            clearButton.addEventListener('click', () => {
                searchInput.value = '';
                currentSearchTerm = '';
                updateClearButton(clearButton, currentSearchTerm);
                performSearch();
            });
        }
    }

    // Update clear button visibility
    function updateClearButton(clearButton, searchTerm) {
        if (clearButton) {
            clearButton.style.display = searchTerm ? 'block' : 'none';
        }
    }

    function performSearch() {
        if (!currentSearchTerm || currentSearchTerm.length < 1) {
            // No search term: show all data and remove highlights
            config.onDataFiltered(config.data);
            removeHighlights(config.highlightClass);
            return;
        }

        const filteredData = config.data.filter(item => {
            // Search through all properties including nested arrays
            return Object.entries(item).some(([key, value]) => {
                // Skip non-searchable properties
                if (key === 'id' || key === 'image') return false;

                // Handle array values (like cuisines, categories)
                if (Array.isArray(value)) {
                    return value.some(subItem =>
                        Object.values(subItem).some(subValue =>
                            String(subValue).toLowerCase().includes(currentSearchTerm.toLowerCase())
                        )
                    );
                }
                // Handle regular string/number values
                else if (value !== null && value !== undefined) {
                    return String(value).toLowerCase().includes(currentSearchTerm.toLowerCase());
                }
                return false;
            });
        });

        config.onDataFiltered(filteredData);

        // Only highlight if search term length is 2 or more
        if (currentSearchTerm.length >= 2) {
            highlightAllMatches(config.highlightClass);
        } else {
            removeHighlights(config.highlightClass);
        }
    }


    // Highlight all matches in the document
    function highlightAllMatches() {
        // First remove existing highlights safely
        removeHighlights();

        if (!currentSearchTerm || currentSearchTerm.length < 2) return;

        const regex = new RegExp(escapeRegExp(currentSearchTerm), 'gi');
        const contentElements = document.querySelectorAll('#results-container .searchable-text');

        contentElements.forEach(element => {
            // Skip elements that are already highlighted or empty
            if (element.classList.contains(config.highlightClass) || !element.textContent.trim()) {
                return;
            }

            // Create a document fragment for the new content
            const fragment = document.createDocumentFragment();
            const text = element.textContent;
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
                // Add text before match
                if (match.index > lastIndex) {
                    fragment.appendChild(document.createTextNode(
                        text.substring(lastIndex, match.index)
                    ));
                }

                // Add highlighted match
                const span = document.createElement('span');
                span.className = config.highlightClass;
                span.textContent = match[0];
                fragment.appendChild(span);

                lastIndex = match.index + match[0].length;

                // Prevent infinite loops for zero-length matches
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
            }

            // Add remaining text if any
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(
                    text.substring(lastIndex)
                ));
            }

            // Only replace if we have content and the element still exists
            if (fragment.childNodes.length > 0 && element.parentNode) {
                element.innerHTML = ''; // Clear existing content
                element.appendChild(fragment);
            }
        });
    }

    // Helper function to escape regex special characters
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


    // Remove existing highlights
    function removeHighlights() {
        const highlights = document.querySelectorAll(`.${config.highlightClass}`);

        highlights.forEach(highlight => {
            // Only proceed if the highlight still exists in the DOM
            if (highlight.parentNode) {
                try {
                    const textNode = document.createTextNode(highlight.textContent);
                    highlight.parentNode.replaceChild(textNode, highlight);
                } catch (error) {
                    console.warn('Failed to remove highlight:', error);
                    // Fallback - just remove the element if replaceChild fails
                    if (highlight.parentNode) {
                        highlight.parentNode.removeChild(highlight);
                    }
                }
            }
        });
    }



    // Public API
    return {
        init,
        getCurrentSearchTerm: () => currentSearchTerm,
        getCurrentData: () => config.data
    };
})();

/**
 * Pagination Component - A reusable client-side pagination utility
 * 
 * Options:
 * - data: Array of objects to paginate through (required)
 * - rowsPerPage: Number of items per page (default 10)
 * - container: DOM element where pagination controls will be rendered (required)
 * - onPageChange: Callback function triggered when page changes, receives sliced data for current page (required)
 
 */
function createPaginator({
    data,
    rowsPerPage = 10,
    container,
    onPageChange
}) {
    let currentPage = 1;
    let totalPages = Math.ceil(data.length / rowsPerPage);

    function getPageData() {
        const start = (currentPage - 1) * rowsPerPage;
        return data.slice(start, start + rowsPerPage);
    }

    function goToPage(pageNum) {
        currentPage = pageNum;
        onPageChange(getPageData());
        renderPaginationUI();
    }

    function createPageBtn(label, pageNum, isActive = false) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = isActive ? 'active' : '';
        btn.onclick = () => goToPage(pageNum);
        return btn;
    }

    function renderPaginationUI() {
        container.innerHTML = '';

        if (totalPages <= 1) return; // Don't show pagination if all fits on one page

        // Previous button (always visible but disabled when on first page)
        const prevBtn = createPageBtn('Prev', currentPage - 1);
        if (currentPage === 1) {
            prevBtn.disabled = true;
            prevBtn.classList.add('disabled');
        }
        container.appendChild(prevBtn);

        // Always show first page
        container.appendChild(createPageBtn(1, 1, currentPage === 1));

        // Left ellipsis
        if (currentPage > 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }

        // Page numbers around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            container.appendChild(createPageBtn(i, i, currentPage === i));
        }

        // Right ellipsis
        if (currentPage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            container.appendChild(ellipsis);
        }

        // Always show last page
        if (totalPages > 1) {
            container.appendChild(createPageBtn(totalPages, totalPages, currentPage === totalPages));
        }

        // Next button (always visible but disabled when on last page)
        const nextBtn = createPageBtn('Next', currentPage + 1);
        if (currentPage === totalPages) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        }
        container.appendChild(nextBtn);
    }

    // Update createPageBtn to handle active state better
    function createPageBtn(label, pageNum, isActive = false) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = isActive ? 'active' : '';
        btn.classList.add('pagination-btn');
        if (isActive) {
            btn.classList.add('active-page'); // Additional class for active page
        }
        // Use image URLs for Prev/Next icons
        if (label === 'Prev') {
            btn.innerHTML = `
            <img src="images/icons/chevron-left.svg" alt="Previous" class="icon" >
            
        `;
        } else if (label === 'Next') {
            btn.innerHTML = `
            
            <img src="images/icons/chevron-right.svg" alt="Next" class="icon">
        `;
        } else {
            btn.textContent = label;
        }
        btn.onclick = () => goToPage(pageNum);
        return btn;
    }

    function update(newData) {
        data = newData;
        totalPages = Math.ceil(data.length / rowsPerPage);
        currentPage = 1;
        onPageChange(getPageData());
        renderPaginationUI();
    }

    // Initial render
    onPageChange(getPageData());
    renderPaginationUI();

    return { update };
}
// Highlight all matches in the current page
function highlightAllMatches(searchTerm) {
    // Remove existing highlights first
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), parent);
    });

    if (!searchTerm || searchTerm.length < 2) return;

    const regex = new RegExp(escapeRegExp(searchTerm), 'gi');
    const contentElements = document.querySelectorAll('#results-container td');

    contentElements.forEach(element => {
        const text = element.textContent;
        if (regex.test(text)) {
            element.innerHTML = text.replace(regex,
                match => `<span class="search-highlight">${match}</span>`
            );
        }
    });
}

// Helper function to escape regex special characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



// --------------------------------
/**
 * Form Validation Utility
 * Handles validation for forms using data-* attributes
 */
const FormValidator = {
    // Default error messages
    defaultErrorMessages: {
        required: 'This field is required',
        type: 'Please enter a valid value',
        maxlength: 'Cannot exceed {max} characters',
        minlength: 'Must be at least {min} characters',
        match: 'Values do not match',
    },

    // Validation rules with their priority and test functions
    validationRules: {
        required: {
            priority: 1,
            test: (input) => {
                console.log(input.type)
                // Skip if not a form element
                if (!(input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement)) {
                    return true;
                }

                if (input.tagName === 'SELECT') {
                    // Handle both regular selects and Bootstrap selects
                    const value = input.value;
                    const isBootstrapSelect = input.classList.contains('selectpicker');

                    // For Bootstrap selects, the empty value might be different
                    if (isBootstrapSelect && input.hasAttribute('multiple')) {
                        return input.selectedOptions.length > 0;
                    }
                    return value !== '' && value !== null;
                }
                // Skip radio inputs (they are validated separately via radio-group)

                // Handle all other inputs (only call trim if value exists)
                return input.value ? input.value.trim() !== '' : false;
            },
            getMessage: (input) => {

                return input.dataset.errorRequired || FormValidator.defaultErrorMessages.required;
            }
        },
        type: {
            priority: 2,
            test: (input) => {
                const type = input.dataset.type;
                const value = input.value.trim();

                if (type === 'email') {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                }
                else if (type === 'url') {
                    // Basic URL pattern that matches http://, https://, or ftp://
                    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value);
                }
                else if (type === 'number') {
                    return /^-?\d*\.?\d+$/.test(value);// Only checks if it's a valid number
                }
                else if (type === 'businessName') {
                    return /^[a-zA-Z0-9\s\-'.&]+$/.test(value);
                }
                else if (type === 'name') {
                    return /^[A-Za-z\s]+$/.test(value);
                }
                // else if (type === 'username') {
                //     return /^[A-Za-z](?!.*[._]{2})[A-Za-z0-9._]{2,19}$/.test(value);
                // }

                return true;
            },
            getMessage: (input) => {
                return input.dataset.errorType || FormValidator.defaultErrorMessages.type;
            }
        },
        radioGroup: {
            priority: 1,
            test: (group) => {
                const radios = group.querySelectorAll('input[type="radio"]');
                return Array.from(radios).some(radio => radio.checked);
            },
            getMessage: (group) => {
                return group.dataset.errorRadio || 'Please select an option';
            }
        },
        checkboxGroup: {
            priority: 1,
            test: (group) => {
                const checkboxes = group.querySelectorAll('input[type="checkbox"]');
                return Array.from(checkboxes).some(checkbox => checkbox.checked);
            },
            getMessage: (group) => {
                return group.dataset.errorCheckbox || 'Please select at least one option';
            }
        },
        date: {
            priority: 2.5,
            test: (input) => {
                const value = input.value.trim();
                // Basic date format validation (YYYY-MM-DD)
                return /^\d{4}-\d{2}-\d{2}$/.test(value);
            },
            getMessage: (input) => {
                return input.dataset.errorDate || 'Please enter a valid date (YYYY-MM-DD)';
            }
        },

        username: {
            priority: 4, // custom validator for username regex
            test: (input) => {
                const value = input.value;
                return /^[A-Za-z](?!.*[._]{2})[A-Za-z0-9._]{2,19}$/.test(value);
            },
            getMessage: (input) => {
                return input.dataset.errorType ||
                    'Username must start with a letter and can include letters, numbers, dots, or underscores.';
            }
        },

        dateAfter: {
            priority: 3,
            test: (input) => {
                const targetField = input.dataset.dateAfter;
                if (!targetField) return true;

                const form = input.form;
                const startDateField = form.querySelector(`[name="${targetField}"]`);
                if (!startDateField || !startDateField.value) return true;

                const endDate = new Date(input.value);
                const startDate = new Date(startDateField.value);

                return endDate > startDate;
            },
            getMessage: (input) => {
                const targetField = input.dataset.dateAfter;
                return input.dataset.errorDateAfter ||
                    `Must be after ${targetField.replace(/_/g, ' ')}`;
            }
        },
        minlength: {
            priority: 3,
            test: (input) => {
                const minLength = parseInt(input.dataset.minlength);
                return input.value.length >= minLength;
            },
            getMessage: (input) => {
                const minLength = input.dataset.minlength;
                return input.dataset.errorMinlength ||
                    FormValidator.defaultErrorMessages.minlength.replace('{min}', minLength);
            }
        },
        maxlength: {
            priority: 3.5,
            test: (input) => {
                const maxLength = parseInt(input.dataset.maxlength);
                return input.value.length <= maxLength;
            },
            getMessage: (input) => {
                const maxLength = input.dataset.maxlength;
                return input.dataset.errorMaxlength ||
                    FormValidator.defaultErrorMessages.maxlength.replace('{max}', maxLength);
            }
        },
        match: {
            priority: 4,
            test: (input) => {
                const fieldToMatch = input.dataset.match;
                if (!fieldToMatch) return true;

                const form = input.form;
                const matchingField = form.querySelector(`[name="${fieldToMatch}"]`);
                if (!matchingField) return true;

                return input.value === matchingField.value;
            },
            getMessage: (input) => {
                return input.dataset.errorMatch || FormValidator.defaultErrorMessages.match;
            }
        }
    },

    // Helper to find the actual visible input (for Bootstrap selects)
    getVisibleInput(input) {
        if (input.classList.contains('selectpicker')) {
            // For Bootstrap selects, return the visible button
            return input.nextElementSibling?.classList.contains('dropdown-toggle')
                ? input.nextElementSibling
                : input;
        }
        return input;
    },

    validateFormById(formId) {
        const formElement = document.getElementById(formId);
        if (!formElement) {
            console.error(`Form with ID "${formId}" not found`);
            return false;
        }
        return this.validateForm(formElement);
    },

    validate(form) {
        if (typeof form === 'string') {
            return this.validateFormById(form);
        } else if (form instanceof HTMLFormElement) {
            return this.validateForm(form);
        }
        console.error('Invalid form reference - must be ID string or form element');
        return false;
    },

    validateForm(formElement) {
        let isValid = true;
        const inputs = formElement.querySelectorAll(`
       [data-required]:not(.radio-group input[type="radio"]), 
      [data-type], 
      [data-minlength], 
      [data-maxlength], 
      [data-match],
      select[data-required]
    `);

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        // Validate radio groups separately
        const radioGroups = formElement.querySelectorAll('.radio-group[data-required]');
        radioGroups.forEach(group => {
            if (!this.validationRules.radioGroup.test(group)) {
                isValid = false;
                this.showRadioGroupError(group, this.validationRules.radioGroup.getMessage(group));
            } else {
                this.clearRadioGroupError(group);
            }
        });

        // Validate checkbox groups separately
        const checkboxGroups = formElement.querySelectorAll('.checkbox-group[data-required]');
        checkboxGroups.forEach(group => {
            if (!this.validationRules.checkboxGroup.test(group)) {
                isValid = false;
                this.showCheckboxGroupError(group, this.validationRules.checkboxGroup.getMessage(group));
            } else {
                this.clearCheckboxGroupError(group);
            }
        });




        return isValid;
    },

    validateField(inputElement) {
        this.clearError(inputElement);

        const applicableRules = Object.entries(this.validationRules)
            .filter(([ruleName]) => inputElement.dataset[ruleName] !== undefined)
            .sort((a, b) => a[1].priority - b[1].priority);

        for (const [ruleName, rule] of applicableRules) {
            if (!rule.test(inputElement)) {
                this.showError(inputElement, rule.getMessage(inputElement));
                return false;
            }
        }

        return true;
    },

    showError(inputElement, message) {
        const visibleInput = this.getVisibleInput(inputElement);
        visibleInput.classList.add('is-invalid');

        let errorElement = visibleInput.nextElementSibling;

        // Check if the next element is a Bootstrap select's dropdown menu
        if (errorElement?.classList?.contains('dropdown-menu')) {
            errorElement = errorElement.nextElementSibling;
        }
        // If error element exists and has 'info-message', remove it
        if (errorElement?.classList?.contains('info-message')) {
            errorElement.remove();
            errorElement = null;
        }
        if (!errorElement || !errorElement.classList.contains('error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error';
            visibleInput.insertAdjacentElement('afterend', errorElement);
        }

        errorElement.textContent = message;

        // Special handling for Bootstrap selects
        if (inputElement.classList.contains('selectpicker')) {
            const wrapper = visibleInput.closest('.bootstrap-select');
            if (wrapper) {
            }
        }
    },

    clearError(inputElement) {
        const visibleInput = this.getVisibleInput(inputElement);
        visibleInput.classList.remove('is-invalid');

        let errorElement = visibleInput.nextElementSibling;

        // Skip Bootstrap select's dropdown menu if present
        if (errorElement?.classList?.contains('dropdown-menu')) {
            errorElement = errorElement.nextElementSibling;
        }

        if (errorElement && errorElement.classList.contains('invalid-feedback')) {
            errorElement.remove();
        }

        // Clear Bootstrap select wrapper
        if (inputElement.classList.contains('selectpicker')) {
            const wrapper = visibleInput.closest('.bootstrap-select');
            if (wrapper) {
                wrapper.classList.remove('is-invalid');
            }
        }
    },
    showRadioGroupError(group, message) {
        group.classList.add('is-invalid');

        // Check if error element already exists *after* the group
        let errorElement = group.nextElementSibling;
        const isErrorElement = errorElement && errorElement.classList.contains('error');

        if (!isErrorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error';
            group.insertAdjacentElement('afterend', errorElement);
        }

        errorElement.textContent = message;
    }
    ,

    clearRadioGroupError(group) {
        group.classList.remove('is-invalid');

        const errorElement = group.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error')) {
            errorElement.remove();
        }
    },
    showCheckboxGroupError(group, message) {
        group.classList.add('is-invalid');

        let errorElement = group.nextElementSibling;
        const isErrorElement = errorElement && errorElement.classList.contains('error');

        if (!isErrorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error checkbox-error mt-1';
            group.insertAdjacentElement('afterend', errorElement);
        }

        errorElement.textContent = message;
    },
    clearCheckboxGroupError(group) {
        group.classList.remove('is-invalid');

        const errorElement = group.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error')) {
            errorElement.remove();
        }
    },


    init() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                if (!this.validateForm(e.target)) {
                    e.preventDefault();
                }
            }
        });

        // Live validation on blur
        document.addEventListener('blur', (e) => {
            const target = e.target;
            if (target.matches(`
        [data-required], 
        [data-type], 
        [data-minlength], 
        [data-maxlength], 
        [data-match],
        select[data-required]
      `)) {
                this.validateField(target);
            }
        }, true);

        document.addEventListener('input', (e) => {
            const target = e.target;
            if (target.matches(`
      [data-required], 
      [data-type], 
      [data-minlength], 
      [data-maxlength], 
      [data-match]
    `)) {
                this.clearError(target);
            }


        });

        // Handle Bootstrap select changes
        document.addEventListener('change', (e) => {
            if (e.target.matches('select.selectpicker[data-required]')) {
                this.validateField(e.target);
            }
        }, true);
        document.addEventListener('change', (e) => {
            const radio = e.target;
            if (radio.matches('input[type="radio"]')) {
                const group = radio.closest('.radio-group[data-required]');
                if (group) {
                    if (FormValidator.validationRules.radioGroup.test(group)) {
                        FormValidator.clearRadioGroupError(group);
                    }
                }
            }
        });
        document.addEventListener('change', (e) => {
            const checkbox = e.target;
            if (checkbox.matches('input[type="checkbox"]')) {
                const group = checkbox.closest('.checkbox-group[data-required]');
                if (group) {
                    if (FormValidator.validationRules.checkboxGroup.test(group)) {
                        FormValidator.clearCheckboxGroupError(group);
                    }
                }
            }
        });


    }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => FormValidator.init());
}

// ----------------

/**
 * MaxLength Enforcer with Combined Counter/Error Display
 */
const MaxLengthEnforcer = {
    init() {
        // Setup existing fields
        document.querySelectorAll('[data-maxlength]').forEach(input => {
            this.setupInputField(input);
        });

        // Watch for dynamically added fields
        new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.hasAttribute('data-maxlength')) {
                            this.setupInputField(node);
                        }
                        node.querySelectorAll('[data-maxlength]').forEach(input => {
                            this.setupInputField(input);
                        });
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    },

    setupInputField(input) {
        const maxLength = parseInt(input.dataset.maxlength);
        const showCounter = input.dataset.showCounter === 'true';

        // Check if error message element already exists
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains('error')) {
            error = document.createElement('small');
            error.className = 'error';
            input.insertAdjacentElement('afterend', error);
        }

        // Only create counter if explicitly requested
        let counter = null;
        if (showCounter) {
            counter = error.nextElementSibling;
            if (!counter || !counter.classList.contains('maxlength-counter')) {
                counter = document.createElement('small');
                counter.className = 'maxlength-counter';
                error.insertAdjacentElement('afterend', counter);
            }
        }

        // Set initial state
        this.updateFeedback(input, counter, error);

        // Add event listeners
        input.addEventListener('input', () => {
            this.handleInput(input, counter, error);
        });
        input.addEventListener('blur', () => {
            this.handleBlur(input, counter, error);
        });
        input.addEventListener('keydown', (e) => {
            this.preventExtraInput(input, maxLength, e);
        });
    },

    handleInput(input, counter, error) {
        const maxLength = parseInt(input.dataset.maxlength);
        const currentLength = input.value.length;

        // Enforce max length
        if (currentLength > maxLength) {
            input.value = input.value.substring(0, maxLength);
        }

        this.updateFeedback(input, counter, error);
    },

    handleBlur(input, counter, error) {
        const maxLength = parseInt(input.dataset.maxlength);
        const currentLength = input.value.length;

        // Keep showing error if limit is exceeded when field loses focus

        if (currentLength >= maxLength) {
            const errorMessage = input.dataset.errorMaxlength ||
                `Maximum ${maxLength} characters allowed`;
            error.textContent = errorMessage;
            error.className = 'error';
            error.classList.add('error', 'info-message');
            // counter.classList.add('at-limit');
        }

    },

    updateFeedback(input, counter, error) {
        const maxLength = parseInt(input.dataset.maxlength);
        const currentLength = input.value.length;

        // Update counter if it exists
        if (counter) {
            counter.textContent = `${currentLength}/${maxLength}`;
            counter.style.float = 'right';
            counter.classList.toggle('at-limit', currentLength >= maxLength);
            counter.classList.toggle('near-limit',
                currentLength >= maxLength * 0.9 && currentLength < maxLength
            );
        }

        // Update error state
        if (currentLength >= maxLength) {
            const errorMessage = input.dataset.errorMaxlength ||
                `Maximum ${maxLength} characters allowed`;
            error.textContent = errorMessage;
            input.classList.add('info-message');
            error.classList.add('info-message');
        } else {
            error.textContent = '';
            error.classList.remove('info-message');
        }
    },

    preventExtraInput(input, maxLength, event) {
        const allowedKeys = [8, 9, 13, 16, 17, 18, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 91, 93];
        if (allowedKeys.includes(event.keyCode)) return;

        if (input.value.length >= maxLength && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
        }
    }
};



// Optional: Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MaxLengthEnforcer;
}
// ---------
document.querySelectorAll('.custom-radio-group-style input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const group = radio.closest('.radio-group');

        // Remove selected class from all
        group.querySelectorAll('.radio-item').forEach(item => {
            item.classList.remove('selected');
        });

        // Add to the selected one
        const selectedItem = radio.closest('.radio-item');
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    });
});
document.querySelectorAll('.radio-group-flex .selection-box input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function () {
        // Remove "selected" class from all
        document.querySelectorAll('.selection-box').forEach(box => {
            box.classList.remove('selected');
        });

        // Add "selected" class to the parent label
        this.closest('.selection-box').classList.add('selected');

        // Update hidden field
        document.getElementById('businessType').value = this.value;

        // Remove error if any
        const errorBox = this.closest('.form-group').querySelector('.business-type-error');
        if (errorBox) errorBox.textContent = '';
    });
});
const PriceCurrencyValidator = {
    init(currencyId, priceId, groupId) {
        this.currency = document.getElementById(currencyId);
        this.price = document.getElementById(priceId);
        this.group = document.getElementById(groupId);

        if (!this.currency || !this.price || !this.group) {
            console.error('One or more elements not found');
            return;
        }

        // Set up event listeners
        this.currency.addEventListener('change', this.handleCurrencyChange.bind(this));
        this.price.addEventListener('input', this.handlePriceInput.bind(this));
        this.price.addEventListener('blur', this.handlePriceBlur.bind(this));
    },

    validate() {
        let isValid = true;
        const issues = [];

        // Clear previous state
        this.clearErrors();

        // Currency validation
        if (!this.currency.value) {
            isValid = false;
            this.currency.classList.add('is-invalid');
            issues.push('select a currency');
        }

        // Price validation
        const priceVal = this.price.value.trim();
        if (!priceVal) {
            isValid = false;
            this.price.classList.add('is-invalid');
            issues.push('enter a price');
        } else if (isNaN(priceVal)) {
            isValid = false;
            this.price.classList.add('is-invalid');
            issues.push('enter a valid number');
        } else if (Number(priceVal) <= 0) {
            isValid = false;
            this.price.classList.add('is-invalid');
            issues.push('enter a price greater than zero');
        }

        // Show error message if invalid
        if (!isValid) {
            this.showGroupError(issues);
        }

        return isValid;
    },

    clearErrors() {
        // Remove existing error message
        const existingError = this.group.querySelector('.group-error');
        if (existingError) existingError.remove();

        // Clear invalid styling
        this.currency.classList.remove('is-invalid');
        this.price.classList.remove('is-invalid');
    },

    showGroupError(issues) {
        const error = document.createElement('div');
        error.className = 'error group-error mt-1';
        error.textContent = `Please ${this.formatIssues(issues)}.`;
        this.group.appendChild(error);
    },

    formatIssues(issues) {
        return issues.join(', ').replace(/, ([^,]*)$/, ' and $1');
    },

    handleCurrencyChange() {
        if (this.currency.value) {
            this.currency.classList.remove('is-invalid');
            const error = this.group.querySelector('.group-error');
            if (error && error.textContent.includes('currency')) {
                this.clearErrors();
            }
        }
    },

    handlePriceInput() {
        const priceVal = this.price.value.trim();
        if (priceVal && !isNaN(priceVal) && Number(priceVal) > 0) {
            this.price.classList.remove('is-invalid');
            const error = this.group.querySelector('.group-error');
            if (error && error.textContent.includes('price')) {
                this.clearErrors();
            }
        }
    },

    handlePriceBlur() {
        this.validate();
    }
};
const PhoneValidator = (() => {
    const input = document.getElementById('phone');
    const group = document.getElementById('intel-phone');

    function clearError() {
        const err = group.querySelector('.phone-error');
        if (err) err.remove();
        input.classList.remove('is-invalid');
    }

    function showError(message) {
        clearError();
        const error = document.createElement('div');
        error.className = 'error phone-error mt-1';
        error.textContent = message;
        group.appendChild(error);
        input.classList.add('is-invalid');
    }

    function validate() {
        const value = input.value.trim();

        if (/[a-zA-Z]/.test(value)) {
            showError("Phone number should not contain letters.");
            return false;
        }

        if (!iti.isValidNumberPrecise()) {
            showError("Please enter a valid phone number.");
            return false;
        }

        clearError();
        return true;
    }

    function attachLiveValidation() {
        input.addEventListener('input', () => {
            clearError(); // Hide error as soon as user starts typing
        });

        input.addEventListener('blur', () => {
            validate(); // Revalidate when user leaves input
        });
    }

    return {
        validate,
        attachLiveValidation,
    };
})();



// --------- 
// Dashboard Menu Manager -Overview Page
// ------------------

/**
 * Render the entire menu from the data model
 */
function renderMenu() {
    const menuCategoriesContainer = document.querySelector('.menu-categories');
    if (!menuCategoriesContainer) return;

    // Clear existing content
    menuCategoriesContainer.innerHTML = '';

    // Render active categories
    window.menuData.categories.forEach(category => {
        if (category.status === 'active') {
            const categoryElement = createCategoryElement(category);
            menuCategoriesContainer.appendChild(categoryElement);
        }
    });

    // Render uncategorized items
    const uncategorizedCategory = createUncategorizedCategory();
    menuCategoriesContainer.appendChild(uncategorizedCategory);
}
// Handle header behavior on scroll for mobile devices
const header = document.querySelector('.main-header');
let lastScrollTop = 0;

// Function to handle scroll events
function handleScroll() {
    // Only apply this behavior on mobile devices
    if (window.innerWidth <= 768) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // If scrolling down and past a threshold (e.g., 60px)
        if (scrollTop > lastScrollTop && scrollTop > 60 && header) {
            // Add compact class to header
            header.classList.add('header-compact');
        }
        // If scrolling up
        else if (scrollTop < lastScrollTop && header) {
            // Remove compact class from header
            header.classList.remove('header-compact');
        }

        // If at the top of the page, always show header
        if (scrollTop <= 10 && header) {
            header.classList.remove('header-compact');
        }

        lastScrollTop = scrollTop;
    }
}

// Add scroll event listener
window.addEventListener('scroll', function () {
    handleScroll();

    // Scroll sırasında açık dropdown'ları kapat
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.status-dropdown, .kebab-dropdown').forEach(dropdown => {
            if (dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
            }
        });
    }
});

// Also handle resize events to adjust behavior
window.addEventListener('resize', function () {
    // Reset header state on resize
    if (window.innerWidth > 768 && header) {
        header.classList.remove('header-compact');
    }

    // Resize sırasında açık dropdown'ları kapat
    document.querySelectorAll('.status-dropdown, .kebab-dropdown').forEach(dropdown => {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        }
    });
});


// Tab switching functionality
const tabs2 = document.querySelectorAll('.tab');
if(tabs2){
tabs2.forEach(tab => {
    tab.addEventListener('click', function () {
        // Remove active class from all tabs
        tabs2.forEach(t => t.classList.remove('active'));

        // Add active class to clicked tab
        this.classList.add('active');

        // Here you would typically show/hide content based on the selected tab
        console.log('Tab clicked:', this.textContent.trim());
    });
});
}


// Search functionality for the header search
const headerSearchInput = document.querySelector('.search-box input');
const headerSearchContainer = document.querySelector('.search-box');
const headerClearIcon = document.querySelector('.search-box .clear-icon');

if (headerSearchInput) {
    headerSearchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        // In a real application, you would perform a global search
        console.log('Global search for:', searchTerm);

        // Show/hide clear icon based on input content
        if (this.value.length > 0) {
            headerSearchContainer.classList.add('has-text');
        } else {
            headerSearchContainer.classList.remove('has-text');
        }
    });

    headerSearchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            console.log('Performing search for:', searchTerm);
            // Prevent form submission if within a form
            e.preventDefault();
        }
    });

    // Add click event for the clear icon
    if (headerClearIcon) {
        headerClearIcon.addEventListener('click', function () {
            headerSearchInput.value = '';
            headerSearchContainer.classList.remove('has-text');
            console.log('Header search cleared');
        });
    }
}

// Search functionality for the menu items search
const menuSearchInput = document.querySelector('.search-for-items input');
const clearFilterButton = document.querySelector('.clear-filter');
const searchContainer = document.querySelector('.search-for-items');
const clearIcon = document.querySelector('.search-for-items .clear-icon');

if (menuSearchInput) {
    menuSearchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        filterMenuItems(searchTerm);

        // Show/hide clear icon based on input content
        if (this.value.length > 0) {
            searchContainer.classList.add('has-text');
        } else {
            searchContainer.classList.remove('has-text');
        }
    });

    menuSearchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const searchTerm = this.value.toLowerCase();
            filterMenuItems(searchTerm);
            // Prevent form submission if within a form
            e.preventDefault();
        }
    });

    // Add click event for the clear icon
    if (clearIcon) {
        clearIcon.addEventListener('click', function () {
            menuSearchInput.value = '';
            searchContainer.classList.remove('has-text');
            resetUIState();
        });
    }
}

// Clear filter functionality
if (clearFilterButton) {
    clearFilterButton.addEventListener('click', function () {
        // Clear the search input
        if (menuSearchInput) {
            menuSearchInput.value = '';

            // Reset the UI to its initial state
            resetUIState();
        }
    });
}

// Filter menu items based on search term
function filterMenuItems(searchTerm) {
    const menuItemRows = document.querySelectorAll('.menu-item-row');
    const noResultsMessage = document.querySelector('.no-results-message');
    const searchTermSpan = document.querySelector('.search-term');
    const menuCategories = document.querySelector('.menu-categories');

    // Hide no results message initially
    if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }

    // Show menu categories
    if (menuCategories) {
        menuCategories.style.display = 'block';
    }

    // First, remove any existing highlights
    document.querySelectorAll('.menu-item-name').forEach(nameElement => {
        if (nameElement) {
            nameElement.innerHTML = nameElement.textContent;
        }

    });

    // If search term is empty, reset UI to initial state and return
    if (searchTerm.length === 0) {
        resetUIState();
        return;
    }

    // Filter the data model first
    const filteredData = filterMenuData(searchTerm);

    // Count visible items
    let visibleItemsCount = 0;

    // Update UI based on filtered data
    menuItemRows.forEach(row => {
        const itemId = row.dataset.itemId;
        const nameElement = row.querySelector('.menu-item-name');

        // Check if this item is in the filtered results
        const isVisible = isItemInFilteredResults(itemId, filteredData);

        if (isVisible) {
            // Show this item
            row.style.display = 'flex';
            visibleItemsCount++;

            // Highlight the matching text
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            nameElement.innerHTML = nameElement.textContent.replace(regex, '<span class="highlight">$1</span>');
        } else {
            // Hide non-matching items
            row.style.display = 'none';
        }
    });

    // Update category visibility based on visible items
    updateCategoriesAfterSearch();

    // Show "no results" message if no items match the search
    if (visibleItemsCount === 0 && searchTerm.length > 0) {
        if (noResultsMessage) {
            noResultsMessage.style.display = 'flex';
            if (searchTermSpan) {
                searchTermSpan.textContent = searchTerm;
            }
        }

        if (menuCategories) {
            menuCategories.style.display = 'none';
        }

        // Hide the note banner
        const noteBanner = document.querySelector('#overviewNote');
        if (noteBanner) {
            noteBanner.style.display = 'none';
        }
    } else {
        // Show the note banner
        const noteBanner = document.querySelector('#overviewNote');
        if (noteBanner) {
            noteBanner.style.display = 'block';
        }
    }

    console.log('Filtering menu items for:', searchTerm);
}

/**
 * Filter the menu data based on search term
 * @param {string} searchTerm - The search term to filter by
 * @returns {Object} - Object containing filtered categories and uncategorized items
 */
function filterMenuData(searchTerm) {
    const result = {
        categories: [],
        uncategorizedItems: []
    };

    // Filter categories and their items
    window.menuData.categories.forEach(category => {
        const filteredItems = category.items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredItems.length > 0) {
            result.categories.push({
                ...category,
                items: filteredItems
            });
        }
    });

    // Filter uncategorized items
    result.uncategorizedItems = window.menuData.uncategorizedItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return result;
}

/**
 * Check if an item is in the filtered results
 * @param {string} itemId - The ID of the item to check
 * @param {Object} filteredData - The filtered data object
 * @returns {boolean} - True if the item is in the filtered results
 */
function isItemInFilteredResults(itemId, filteredData) {
    // Check in categories
    for (const category of filteredData.categories) {
        if (category.items.some(item => item.id === itemId)) {
            return true;
        }
    }

    // Check in uncategorized items
    if (filteredData.uncategorizedItems.some(item => item.id === itemId)) {
        return true;
    }

    return false;
}

/**
 * Reset the UI to its initial state
 * This function is called when clearing filters or on page load
 */
function resetUIState() {
    // Show all categories
    document.querySelectorAll('.category-item').forEach(category => {
        category.style.display = 'block';
    });

    // Show all menu items except those with 'hidden' status
    document.querySelectorAll('.menu-item-row').forEach(row => {
        const statusDisplay = row.querySelector('.menu-item-status');
        if (statusDisplay && statusDisplay.classList.contains('hidden')) {
            row.style.display = 'none';
        } else {
            row.style.display = 'flex';
        }
    });

    // Remove any existing highlights from menu item names
    document.querySelectorAll('.menu-item-name').forEach(nameElement => {
        nameElement.innerHTML = nameElement.textContent;
    });

    // Update all category item counts
    updateAllCategoryItemCounts();

    // Hide no results message
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }

    // Show the menu categories container
    const menuCategories = document.querySelector('.menu-categories');
    if (menuCategories) {
        menuCategories.style.display = 'block';
    }

    // Show the note banner
    const noteBanner = document.querySelector('#overviewNote');
    if (noteBanner) {
        noteBanner.style.display = 'block';
    }

    // We no longer force Uncategorized Items to be closed
    // All categories can now be opened and closed by the user

    console.log('UI reset to initial state');
}

/**
 * Update item counts for all categories
 */
function updateAllCategoryItemCounts() {
    const categories = document.querySelectorAll('.category-item');
    categories.forEach(category => {
        updateCategoryItemCount(category);
    });
}

/**
 * Update category visibility and item counts during search
 */
function updateCategoriesAfterSearch() {
    const categories = document.querySelectorAll('.category-item');
    categories.forEach(category => {
        const items = category.querySelectorAll('.menu-item-row');
        const visibleItems = Array.from(items).filter(item => item.style.display !== 'none');

        // Update item count
        const itemCountElement = category.querySelector('.item-count');
        if (itemCountElement) {
            itemCountElement.textContent = `${visibleItems.length} items`;
        }

        // During search, hide categories with no visible items
        if (visibleItems.length === 0) {
            category.style.display = 'none';
        } else {
            category.style.display = 'block';

            // Get the category ID to check if it's the Uncategorized Items category
            const categoryId = category.dataset.categoryId;

            // For categories with matching items, expand them to show the items
            // Always expand the Uncategorized Items category if it has matching items
            if (categoryId === 'uncategorized' || visibleItems.length > 0) {
                const categoryItems = category.querySelector('.category-items');
                const toggleIcon = category.querySelector('.toggle-icon img');

                if (categoryItems) {
                    // Expand the category items container
                    categoryItems.style.display = 'block';

                    // Update the toggle icon rotation if it exists
                    if (toggleIcon) {
                        toggleIcon.style.transform = 'rotate(0deg)';
                    }
                }
            }
        }
    });
}

// Helper function to escape special characters in regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Add items button functionality has been removed

// Mobile menu functionality
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const openSidebarBtn = document.getElementById('openSidebarBtn');

// Function to toggle sidebar visibility
function toggleSidebar() {
    sidebar.classList.toggle('active');

    // If sidebar is now active, add overlay and prevent body scroll
    if (sidebar.classList.contains('active')) {
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);

            // Add click event to close sidebar when overlay is clicked
            overlay.addEventListener('click', function () {
                toggleSidebar();
            });
        }

        // Show overlay with animation
        overlay.classList.add('show');

        // Prevent body scroll
        document.body.classList.add('sidebar-open');
    } else {
        // Hide overlay and restore body scroll
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            // Remove overlay after animation completes
            setTimeout(() => {
                if (overlay && !overlay.classList.contains('show')) {
                    overlay.remove();
                }
            }, 300);
        }

        // Restore body scroll
        document.body.classList.remove('sidebar-open');
    }
}

// Disable mobile menu toggle functionality
// if (mobileMenuToggle) {
//     mobileMenuToggle.addEventListener('click', toggleSidebar);
// }

if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', toggleSidebar);
}

// Hide/show open sidebar button based on screen size
function updateOpenSidebarButtonVisibility() {
    if (openSidebarBtn) {
        if (window.innerWidth <= 768) {
            openSidebarBtn.style.display = 'flex';
        } else {
            openSidebarBtn.style.display = 'none';
        }
    }
}




// Make header icons interactive
const headerIcons = document.querySelectorAll('.header-icons .icon-item');

headerIcons.forEach(icon => {
    icon.addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Header icon clicked:', this.querySelector('i').className);
    });
});

// Use event delegation for category toggling
document.addEventListener('click', function (e) {
    // Handle toggle icon clicks
    if (e.target.closest('.toggle-icon') || e.target.matches('.toggle-icon img')) {
        e.stopPropagation(); // Prevent the header click event from firing
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            toggleCategoryItems(categoryItem);
        }
    }
    // Handle category header clicks
    else if (e.target.closest('.category-header')) {
        // Don't toggle if clicking on the kebab menu or its dropdown
        if (e.target.closest('.menu-kebab') || e.target.closest('.kebab-dropdown')) {
            return;
        }
        const categoryItem = e.target.closest('.category-item');
        if (categoryItem) {
            toggleCategoryItems(categoryItem);
        }
    }
});

// Function to toggle category items visibility
function toggleCategoryItems(categoryItem) {
    // For all categories, toggle as normal
    const categoryItems = categoryItem.querySelector('.category-items');
    const toggleIcon = categoryItem.querySelector('.toggle-icon img');

    if (!categoryItems || !toggleIcon) return;

    // Get computed style to check actual visibility
    const displayStyle = window.getComputedStyle(categoryItems).display;

    if (displayStyle === 'none') {
        categoryItems.style.display = 'block';
        toggleIcon.style.transform = 'rotate(0deg)';
    } else {
        categoryItems.style.display = 'none';
        toggleIcon.style.transform = 'rotate(-90deg)';
    }
}

// Make all categories initially collapsed
document.querySelectorAll('.category-items').forEach(categoryItems => {
    // Collapse all categories
    categoryItems.style.display = 'none';

    // Set toggle icon to collapsed state
    const toggleIcon = categoryItems.closest('.category-item').querySelector('.toggle-icon img');
    if (toggleIcon) {
        toggleIcon.style.transform = 'rotate(-90deg)';
    }
});

// Make menu item rows clickable (for mobile)
document.querySelectorAll('.menu-item-row').forEach(row => {
    row.addEventListener('click', function (e) {
        // Don't trigger if clicking on status or kebab menu
        if (!e.target.closest('.menu-item-status-container') &&
            !e.target.closest('.menu-item-actions')) {
            const itemName = this.querySelector('.menu-item-name').textContent;
            console.log(`Menu item clicked: ${itemName}`);
            // Here you could show item details or open an edit modal
        }
    });
});

// Use event delegation for status dropdown toggle
document.addEventListener('click', function (e) {
    // Handle status display clicks
    if (e.target.closest('.menu-item-status') || e.target.matches('.menu-item-status')) {
        console.log('Status button clicked');
        e.stopPropagation();
        e.preventDefault(); // Prevent any default behavior

        const statusDisplay = e.target.closest('.menu-item-status');
        if (!statusDisplay) return;

        const statusContainer = statusDisplay.closest('.menu-item-status-container');
        if (!statusContainer) return;

        const statusDropdown = statusContainer.querySelector('.status-dropdown');
        if (!statusDropdown) return;

        // Close all other dropdowns first
        document.querySelectorAll('.status-dropdown, .kebab-dropdown').forEach(dropdown => {
            if (dropdown !== statusDropdown) {
                dropdown.style.display = 'none';
            }
        });

        // Tüm dropdown'ları kapat
        document.querySelectorAll('.status-dropdown').forEach(dropdown => {
            if (dropdown !== statusDropdown) {
                dropdown.style.display = 'none';
            }
        });

        // Force display block regardless of current state
        // This ensures the dropdown is always shown when clicked
        if (statusDropdown.style.display === 'block') {
            statusDropdown.style.display = 'none';
        } else {
            // Unified positioning for mobile and desktop
            if (window.innerWidth <= 768) {
                // Mobile: use fixed positioning
                const rect = statusDisplay.getBoundingClientRect();
                statusDropdown.style.position = 'fixed';
                statusDropdown.style.top = (rect.bottom + 5) + 'px';
                statusDropdown.style.left = rect.left + 'px';
                statusDropdown.style.width = Math.max(150, rect.width) + 'px';
            } else {
                // Desktop: use absolute positioning (default CSS)
                statusDropdown.style.position = '';
                statusDropdown.style.top = '';
                statusDropdown.style.left = '';
                statusDropdown.style.width = '';
            }
            statusDropdown.style.display = 'block';
            console.log('Dropdown should be visible now');
        }
    }

    // Handle status option clicks
    if (e.target.closest('.status-option') || e.target.matches('.status-option')) {
        const statusOption = e.target.closest('.status-option');
        if (!statusOption) return;

        const newStatus = statusOption.getAttribute('data-value');
        const statusDropdown = statusOption.closest('.status-dropdown');
        if (!statusDropdown) return;

        const statusContainer = statusDropdown.closest('.menu-item-status-container');
        if (!statusContainer) return;

        const statusDisplay = statusContainer.querySelector('.menu-item-status');
        if (!statusDisplay) return;

        const menuItemRow = statusContainer.closest('.menu-item-row');
        if (!menuItemRow) return;

        const itemId = menuItemRow.dataset.itemId;

        statusDisplay.querySelector('span').textContent = statusOption.textContent.trim();

        const statusIcon = statusDisplay.querySelector('.status-icon');
        if (statusIcon) {
            let statusIconSrc;
            if (newStatus === 'available') {
                statusIconSrc = 'images/icons/status-dot-available.svg';
                statusDisplay.classList.remove('out-of-stock-style', 'hidden-style');
            } else if (newStatus === 'out-of-stock') {
                statusIconSrc = 'images/icons/status-dot-out-of-stock.svg';
                statusDisplay.classList.remove('hidden-style');
                statusDisplay.classList.add('out-of-stock-style');
            } else if (newStatus === 'hidden') {
                statusIconSrc = 'images/icons/hidden-icon.svg';
                statusDisplay.classList.remove('out-of-stock-style');
                statusDisplay.classList.add('hidden-style');
            }
            statusIcon.src = statusIconSrc;
        }

        // Hide the dropdown
        statusDropdown.style.display = 'none';

        // Update the status in the data model
        updateItemStatus(itemId, newStatus);

        // Handle different status changes
        if (newStatus === 'hidden') {
            // In the Overview tab, hide the item
            menuItemRow.style.display = 'none';

            // Update item count for the category
            updateCategoryItemCount(menuItemRow.closest('.category-item'));

            // Show item hidden toast notification
            if (typeof showItemHiddenToast === 'function') {
                showItemHiddenToast();
            }

            // Check if we need to show empty state
            if (typeof checkAndShowEmptyState === 'function') {
                checkAndShowEmptyState();
            }
        } else if (newStatus === 'out-of-stock') {
            // Show out of stock toast notification
            if (typeof showItemOutOfStockToast === 'function') {
                showItemOutOfStockToast();
            }
        } else if (newStatus === 'available') {
            // Show available toast notification
            if (typeof showItemAvailableToast === 'function') {
                showItemAvailableToast();
            }
        }
    }
});

/**
 * Update an item's status in the data model
 * @param {string} itemId - The ID of the item to update
 * @param {string} newStatus - The new status value
 */
function updateItemStatus(itemId, newStatus) {
    // Check categories first
    let itemFound = false;

    // Look in regular categories
    window.menuData.categories.forEach(category => {
        const itemIndex = category.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            category.items[itemIndex].status = newStatus;
            itemFound = true;
            console.log(`Updated status for item ${itemId} in category ${category.title} to ${newStatus}`);
        }
    });

    // If not found in categories, check uncategorized items
    if (!itemFound) {
        const itemIndex = window.menuData.uncategorizedItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            window.menuData.uncategorizedItems[itemIndex].status = newStatus;
            console.log(`Updated status for uncategorized item ${itemId} to ${newStatus}`);
        }
    }
}

document.addEventListener('click', function (e) {
    // Don't close dropdowns if clicking on a kebab menu or inside a dropdown
    if (e.target.closest('.menu-kebab') || e.target.closest('.kebab-dropdown') ||
        e.target.closest('.menu-item-status') || e.target.closest('.status-dropdown')) {
        return;
    }

    // Close all dropdowns
    document.querySelectorAll('.status-dropdown, .kebab-dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
    });
});

// Kebab menu functionality is now handled by event delegation in category-manager.js

// "Remove from category" option is now handled by event delegation in category-manager.js

// Function to update category item count
function updateCategoryItemCount(categoryItem) {
    if (!categoryItem) return;

    const visibleItems = Array.from(categoryItem.querySelectorAll('.menu-item-row'))
        .filter(item => item.style.display !== 'none');

    const itemCountElement = categoryItem.querySelector('.item-count');
    if (itemCountElement) {
        itemCountElement.textContent = `${visibleItems.length} items`;
    }
}

// Function to show toast notification - Kept for reference but not used directly
/*
function showToast(title, message) {
    // Use the existing toast container from the HTML
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Clear any existing toasts
    toastContainer.innerHTML = '';

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Create toast content
    toastElement.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    // Show toast
    toast.show();
}
*/

// Category deactivation toast functionality has been moved to category-manager.js

function initDragAndDrop() {
    // Get all draggable elements
    const categoryItems = document.querySelectorAll('.category-item');
    const menuItemRows = document.querySelectorAll('.menu-item-row');

    // Make categories draggable
    categoryItems.forEach(item => {
        const dragHandle = item.querySelector('.drag-handle');

        if (dragHandle) {
            // Mouse events for desktop
            dragHandle.addEventListener('mousedown', function (e) {
                handleCategoryDragStart(e, item, false);
            });

            // Touch events for mobile
            dragHandle.addEventListener('touchstart', function (e) {
                handleCategoryDragStart(e, item, true);
            });

            function handleCategoryDragStart(e, item, isTouch) {
                // Prevent default to avoid text selection during drag
                e.preventDefault();
                // Stop propagation to prevent category header click
                e.stopPropagation();

                // Flag to track if we're actually dragging or just clicking
                let isDragging = false;

                // Add dragging class with a slight delay for smooth transition
                setTimeout(() => {
                    item.classList.add('dragging');
                }, 10);

                // Set up move and end events based on device type
                if (isTouch) {
                    document.addEventListener('touchmove', moveCategoryTouch);
                    document.addEventListener('touchend', endCategoryDragTouch);
                    document.addEventListener('touchcancel', endCategoryDragTouch);
                } else {
                    document.addEventListener('mousemove', moveCategory);
                    document.addEventListener('mouseup', endCategoryDrag);
                }

                // Store initial position
                const initialY = isTouch ? e.touches[0].clientY : e.clientY;
                const categories = document.querySelector('.menu-categories');
                const categoryItems = Array.from(categories.querySelectorAll('.category-item'));
                const initialIndex = categoryItems.indexOf(item);

                // Get category ID
                const categoryId = item.dataset.categoryId;

                // Mouse move handler
                function moveCategory(e) {
                    handleCategoryMove(e.clientY);
                }

                // Touch move handler
                function moveCategoryTouch(e) {
                    if (e.touches.length > 0) {
                        handleCategoryMove(e.touches[0].clientY);
                    }
                }

                // Common move logic
                function handleCategoryMove(clientY) {
                    // Set dragging flag to true once we've moved a bit
                    if (Math.abs(clientY - initialY) > 5) {
                        isDragging = true;
                    }

                    if (!isDragging) return;

                    // Find the category we're hovering over
                    const hoverCategory = categoryItems.find(cat => {
                        if (cat === item) return false;

                        const rect = cat.getBoundingClientRect();
                        return clientY > rect.top && clientY < rect.bottom;
                    });

                    if (hoverCategory) {
                        const hoverIndex = categoryItems.indexOf(hoverCategory);
                        const hoverId = hoverCategory.dataset.categoryId;

                        // Reorder in the DOM
                        if (hoverIndex < initialIndex) {
                            categories.insertBefore(item, hoverCategory);
                        } else {
                            categories.insertBefore(item, hoverCategory.nextSibling);
                        }

                        // Update the order in the data model
                        if (categoryId !== 'uncategorized' && hoverId !== 'uncategorized') {
                            updateCategoryOrder(categoryId, hoverId);
                        }
                    }
                }

                // Mouse end handler
                function endCategoryDrag() {
                    handleCategoryDragEnd();
                    document.removeEventListener('mousemove', moveCategory);
                    document.removeEventListener('mouseup', endCategoryDrag);
                }

                // Touch end handler
                function endCategoryDragTouch() {
                    handleCategoryDragEnd();
                    document.removeEventListener('touchmove', moveCategoryTouch);
                    document.removeEventListener('touchend', endCategoryDragTouch);
                    document.removeEventListener('touchcancel', endCategoryDragTouch);
                }

                // Common end logic
                function handleCategoryDragEnd() {
                    // Remove dragging class with a smooth transition
                    if (isDragging) {
                        // First, add a class for transition out
                        item.classList.add('drag-ending');

                        // Then remove the dragging class after a short delay
                        setTimeout(() => {
                            item.classList.remove('dragging');
                            item.classList.remove('drag-ending');
                        }, 150);
                    } else {
                        // If not actually dragged, just remove the class
                        item.classList.remove('dragging');
                    }
                }
            }
        }
    });

    // Make menu items draggable
    menuItemRows.forEach(row => {
        const dragHandle = row.querySelector('.drag-handle');

        if (dragHandle) {
            // Mouse events for desktop
            dragHandle.addEventListener('mousedown', function (e) {
                handleItemDragStart(e, row, false);
            });

            // Touch events for mobile
            dragHandle.addEventListener('touchstart', function (e) {
                handleItemDragStart(e, row, true);
            });

            function handleItemDragStart(e, row, isTouch) {
                // Prevent default to avoid text selection during drag
                e.preventDefault();
                // Stop propagation to prevent row click
                e.stopPropagation();

                // Flag to track if we're actually dragging or just clicking
                let isDragging = false;

                // Add dragging class with a slight delay for smooth transition
                setTimeout(() => {
                    row.classList.add('dragging');
                }, 10);

                // Set up move and end events based on device type
                if (isTouch) {
                    document.addEventListener('touchmove', moveItemTouch);
                    document.addEventListener('touchend', endItemDragTouch);
                    document.addEventListener('touchcancel', endItemDragTouch);
                } else {
                    document.addEventListener('mousemove', moveItem);
                    document.addEventListener('mouseup', endItemDrag);
                }

                // Store initial position
                const initialY = isTouch ? e.touches[0].clientY : e.clientY;
                const categoryItems = row.closest('.category-items');
                const menuItemRows = Array.from(categoryItems.querySelectorAll('.menu-item-row'));
                const initialIndex = menuItemRows.indexOf(row);

                // Get item and category IDs
                const itemId = row.dataset.itemId;
                const categoryElement = row.closest('.category-item');
                const categoryId = categoryElement ? categoryElement.dataset.categoryId : null;

                // Mouse move handler
                function moveItem(e) {
                    handleItemMove(e.clientY);
                }

                // Touch move handler
                function moveItemTouch(e) {
                    if (e.touches.length > 0) {
                        handleItemMove(e.touches[0].clientY);
                    }
                }

                // Common move logic
                function handleItemMove(clientY) {
                    // Set dragging flag to true once we've moved a bit
                    if (Math.abs(clientY - initialY) > 5) {
                        isDragging = true;
                    }

                    if (!isDragging) return;

                    // Find the item we're hovering over
                    const hoverItem = menuItemRows.find(item => {
                        if (item === row) return false;

                        const rect = item.getBoundingClientRect();
                        return clientY > rect.top && clientY < rect.bottom;
                    });

                    if (hoverItem) {
                        const hoverIndex = menuItemRows.indexOf(hoverItem);
                        const hoverId = hoverItem.dataset.itemId;

                        // Reorder in the DOM
                        if (hoverIndex < initialIndex) {
                            categoryItems.insertBefore(row, hoverItem);
                        } else {
                            categoryItems.insertBefore(row, hoverItem.nextSibling);
                        }

                        // Update the order in the data model
                        updateItemOrder(itemId, hoverId, categoryId);
                    }
                }

                // Mouse end handler
                function endItemDrag() {
                    handleItemDragEnd();
                    document.removeEventListener('mousemove', moveItem);
                    document.removeEventListener('mouseup', endItemDrag);
                }

                // Touch end handler
                function endItemDragTouch() {
                    handleItemDragEnd();
                    document.removeEventListener('touchmove', moveItemTouch);
                    document.removeEventListener('touchend', endItemDragTouch);
                    document.removeEventListener('touchcancel', endItemDragTouch);
                }

                // Common end logic
                function handleItemDragEnd() {
                    // Remove dragging class with a smooth transition
                    if (isDragging) {
                        // First, add a class for transition out
                        row.classList.add('drag-ending');

                        // Then remove the dragging class after a short delay
                        setTimeout(() => {
                            row.classList.remove('dragging');
                            row.classList.remove('drag-ending');
                        }, 150);
                    } else {
                        // If not actually dragged, just remove the class
                        row.classList.remove('dragging');
                    }
                }
            }
        }
    });
}

/**
 * Update the order of categories in the data model
 * @param {string} categoryId - The ID of the category being moved
 * @param {string} targetCategoryId - The ID of the category it's being moved to
 */
function updateCategoryOrder(categoryId, targetCategoryId) {
    // Find the categories in the data model
    const categoryIndex = window.menuData.categories.findIndex(cat => cat.id === categoryId);
    const targetIndex = window.menuData.categories.findIndex(cat => cat.id === targetCategoryId);

    if (categoryIndex === -1 || targetIndex === -1) return;

    // Remove the category from its current position
    const [category] = window.menuData.categories.splice(categoryIndex, 1);

    // Insert it at the new position
    window.menuData.categories.splice(targetIndex, 0, category);

    // Update order values
    window.menuData.categories.forEach((cat, index) => {
        cat.order = index + 1;
    });

    console.log(`Moved category ${categoryId} to position ${targetIndex}`);
}

/**
 * Update the order of items in the data model
 * @param {string} itemId - The ID of the item being moved
 * @param {string} targetItemId - The ID of the item it's being moved to
 * @param {string} categoryId - The ID of the category containing the items
 */
function updateItemOrder(itemId, targetItemId, categoryId) {
    if (categoryId === 'uncategorized') {
        // Handle uncategorized items
        const itemIndex = window.menuData.uncategorizedItems.findIndex(item => item.id === itemId);
        const targetIndex = window.menuData.uncategorizedItems.findIndex(item => item.id === targetItemId);

        if (itemIndex === -1 || targetIndex === -1) return;

        // Remove the item from its current position
        const [item] = window.menuData.uncategorizedItems.splice(itemIndex, 1);

        // Insert it at the new position
        window.menuData.uncategorizedItems.splice(targetIndex, 0, item);

        console.log(`Moved uncategorized item ${itemId} to position ${targetIndex}`);
    } else {
        // Handle items in a category
        const category = window.menuData.categories.find(cat => cat.id === categoryId);
        if (!category) return;

        const itemIndex = category.items.findIndex(item => item.id === itemId);
        const targetIndex = category.items.findIndex(item => item.id === targetItemId);

        if (itemIndex === -1 || targetIndex === -1) return;

        // Remove the item from its current position
        const [item] = category.items.splice(itemIndex, 1);

        // Insert it at the new position
        category.items.splice(targetIndex, 0, item);

        console.log(`Moved item ${itemId} in category ${categoryId} to position ${targetIndex}`);
    }
}



// Check for empty state if the function exists in category-manager.js
if (typeof checkAndShowEmptyState === 'function') {
    // Wait a bit to ensure all DOM updates are complete
    setTimeout(checkAndShowEmptyState, 100);
}



/**
 * Create a category element from category data
 * @param {Object} category - The category data
 * @returns {HTMLElement} - The category element
 */
function createCategoryElement(category) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.dataset.categoryId = category.id;

    // Create category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';

    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '<img src="images/icons/drag-handle.svg" alt="Drag">';

    // Create category info
    const categoryInfo = document.createElement('div');
    categoryInfo.className = 'category-info';

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category.title;

    const categoryMeta = document.createElement('div');
    categoryMeta.className = 'category-meta';

    const categoryStatus = document.createElement('span');
    categoryStatus.className = 'category-status';
    categoryStatus.textContent = 'Active category';

    const categoryDot = document.createElement('span');
    categoryDot.className = 'category-dot';

    const itemCount = document.createElement('span');
    itemCount.className = 'item-count';
    itemCount.textContent = `${category.items.length} items`;

    categoryMeta.appendChild(categoryStatus);
    categoryMeta.appendChild(categoryDot);
    categoryMeta.appendChild(itemCount);

    categoryInfo.appendChild(categoryTitle);
    categoryInfo.appendChild(categoryMeta);

    // Create category actions
    const categoryActions = document.createElement('div');
    categoryActions.className = 'category-actions';

    const menuKebab = document.createElement('div');
    menuKebab.className = 'menu-kebab';
    menuKebab.innerHTML = '<img src="images/icons/menu-kebab-horizontal.svg" alt="Menu">';

    const kebabDropdown = document.createElement('div');
    kebabDropdown.className = 'kebab-dropdown category-kebab-dropdown';
    kebabDropdown.innerHTML = '<div class="kebab-option deactivate-category">Deactivate Category</div>';

    const toggleIcon = document.createElement('div');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.innerHTML = '<img src="images/icons/chevron-down.svg" alt="Toggle">';

    categoryActions.appendChild(menuKebab);
    categoryActions.appendChild(kebabDropdown);
    categoryActions.appendChild(toggleIcon);

    // Assemble category header
    categoryHeader.appendChild(dragHandle);
    categoryHeader.appendChild(categoryInfo);
    categoryHeader.appendChild(categoryActions);

    // Create category items container
    const categoryItems = document.createElement('div');
    categoryItems.className = 'category-items';

    // Add items to category
    if (category.items.length > 0) {
        category.items.forEach(item => {
            const itemElement = createItemElement(item);
            categoryItems.appendChild(itemElement);
        });
    } else {
        // Add empty category message
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-category-message';
        emptyMessage.textContent = 'No items added to this category yet.';
        categoryItems.appendChild(emptyMessage);
    }

    // Assemble category element
    categoryElement.appendChild(categoryHeader);
    categoryElement.appendChild(categoryItems);

    return categoryElement;
}

/**
 * Create the uncategorized items category
 * @returns {HTMLElement} - The uncategorized category element
 */
function createUncategorizedCategory() {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.dataset.categoryId = 'uncategorized';

    // Create category header
    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'category-header';

    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '<img src="images/icons/drag-handle.svg" alt="Drag">';

    // Create category info
    const categoryInfo = document.createElement('div');
    categoryInfo.className = 'category-info';

    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = 'Uncategorized Items';

    const categoryMeta = document.createElement('div');
    categoryMeta.className = 'category-meta';

    const itemCount = document.createElement('span');
    itemCount.className = 'item-count';

    // Filter out hidden items for the count
    const visibleItems = window.menuData.uncategorizedItems.filter(item => item.status !== 'hidden');
    itemCount.textContent = `${visibleItems.length} items`;

    categoryMeta.appendChild(itemCount);

    categoryInfo.appendChild(categoryTitle);
    categoryInfo.appendChild(categoryMeta);

    // Create category actions
    const categoryActions = document.createElement('div');
    categoryActions.className = 'category-actions';

    const menuKebab = document.createElement('div');
    menuKebab.className = 'menu-kebab';
    menuKebab.innerHTML = '<img src="images/icons/menu-kebab-horizontal.svg" alt="Menu">';

    const kebabDropdown = document.createElement('div');
    kebabDropdown.className = 'kebab-dropdown category-kebab-dropdown';
    kebabDropdown.innerHTML = '<div class="kebab-option deactivate-category">Deactivate Category</div>';

    const toggleIcon = document.createElement('div');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.innerHTML = '<img src="images/icons/chevron-down.svg" alt="Toggle">';

    categoryActions.appendChild(menuKebab);
    categoryActions.appendChild(kebabDropdown);
    categoryActions.appendChild(toggleIcon);

    // Assemble category header
    categoryHeader.appendChild(dragHandle);
    categoryHeader.appendChild(categoryInfo);
    categoryHeader.appendChild(categoryActions);

    // Create category items container
    const categoryItems = document.createElement('div');
    categoryItems.className = 'category-items';

    // Add items to category
    window.menuData.uncategorizedItems.forEach(item => {
        // Only render non-hidden items in the UI
        if (item.status !== 'hidden') {
            // Pass true as the second parameter to indicate this is in the Uncategorized Items section
            const itemElement = createItemElement(item, true);
            categoryItems.appendChild(itemElement);
        }
    });

    // Assemble category element
    categoryElement.appendChild(categoryHeader);
    categoryElement.appendChild(categoryItems);

    return categoryElement;
}

/**
 * Create a menu item element from item data
 * @param {Object} item - The item data
 * @param {boolean} [isInUncategorizedSection=false] - Whether this item is being rendered in the Uncategorized Items section
 * @returns {HTMLElement} - The item element
 */
function createItemElement(item, isInUncategorizedSection = false) {
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item-row';
    itemElement.dataset.itemId = item.id;

    // Set display style based on status
    if (item.status === 'hidden') {
        itemElement.style.display = 'none';
    }

    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '<img src="images/icons/drag-handle.svg" alt="Drag">';

    // Create item image or placeholder
    let itemImageContainer;
    if (item.image) {
        itemImageContainer = document.createElement('div');
        itemImageContainer.className = 'menu-item-image';
        itemImageContainer.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    } else {
        itemImageContainer = document.createElement('div');
        itemImageContainer.className = 'menu-item-image-placeholder';
        itemImageContainer.innerHTML = '<img src="images/icons/image-icon.svg" alt="image-icon">';
    }

    // Create item details
    const itemDetails = document.createElement('div');
    itemDetails.className = 'menu-item-details';

    const itemName = document.createElement('div');
    itemName.className = 'menu-item-name';
    itemName.textContent = item.name;

    // Create a container for price and status (for mobile view)
    const priceStatusContainer = document.createElement('div');
    priceStatusContainer.className = 'menu-item-price-status-container';

    const itemPrice = document.createElement('div');
    itemPrice.className = 'menu-item-price';
    itemPrice.textContent = item.price;

    itemDetails.appendChild(itemName);
    itemDetails.appendChild(priceStatusContainer);
    priceStatusContainer.appendChild(itemPrice);

    // Create item status container
    const statusContainer = document.createElement('div');
    statusContainer.className = 'menu-item-status-container';

    const statusDisplay = document.createElement('div');
    statusDisplay.className = `menu-item-status ${item.status}`;

    // Create status icon based on status
    let statusIconSrc;
    if (item.status === 'available') {
        statusIconSrc = 'images/icons/status-dot-available.svg';
    } else if (item.status === 'out-of-stock') {
        statusIconSrc = 'images/icons/status-dot-out-of-stock.svg';
    } else if (item.status === 'hidden') {
        statusIconSrc = 'images/icons/hidden-icon.svg';
    }

    statusDisplay.innerHTML = `
            <img src="${statusIconSrc}" alt="${item.status}" class="status-icon">
            <span>${item.status.replace('-', ' ')}</span>
            <img src="images/icons/chevron-down.svg" alt="Toggle" class="status-toggle">
        `;

    // Create status dropdown
    const statusDropdown = document.createElement('div');
    statusDropdown.className = 'status-dropdown';
    statusDropdown.innerHTML = `
            <div class="status-option" data-value="available">
                <img src="images/icons/status-dot-available.svg" alt="Available" class="status-icon">
                Available
            </div>
            <div class="status-option" data-value="out-of-stock">
                <img src="images/icons/status-dot-out-of-stock.svg" alt="Out of Stock" class="status-icon">
                Out of Stock
            </div>
            <div class="status-option" data-value="hidden">
                <img src="images/icons/hidden-icon.svg" alt="Hidden" class="status-icon">
                Hidden
            </div>
        `;

    statusContainer.appendChild(statusDisplay);
    statusContainer.appendChild(statusDropdown);

    // Create item actions
    const itemActions = document.createElement('div');
    itemActions.className = 'menu-item-actions';

    const itemKebab = document.createElement('div');
    itemKebab.className = 'menu-kebab';
    itemKebab.innerHTML = '<img src="images/icons/menu-kebab-horizontal.svg" alt="Menu">';

    const itemDropdown = document.createElement('div');
    itemDropdown.className = 'kebab-dropdown';

    // Determine if this is an uncategorized item
    // Check both the data model and whether it's being rendered in the Uncategorized Items section
    const isUncategorized = isInUncategorizedSection || window.menuData.uncategorizedItems.some(uncatItem => uncatItem.id === item.id);

    if (isUncategorized) {
        // For uncategorized items, only show the Edit option
        itemDropdown.innerHTML = '<div class="kebab-option">Edit item</div>';
    } else {
        // For categorized items, show both Edit and Remove options
        itemDropdown.innerHTML = `
                <div class="kebab-option">Edit item</div>
                <div class="kebab-option remove">Remove from category</div>
            `;
    }

    itemActions.appendChild(itemKebab);
    itemActions.appendChild(itemDropdown);

    // Standard desktop layout
    itemElement.appendChild(dragHandle);
    itemElement.appendChild(itemImageContainer);
    itemElement.appendChild(itemDetails);
    itemElement.appendChild(statusContainer);
    itemElement.appendChild(itemActions);

    // We don't need to add direct event listeners here
    // The global event delegation in the document.addEventListener('click'...) handler
    // will take care of status dropdown toggling and option selection

    // We also don't need to add a document click listener for each item
    // as we already have a global one that handles closing all dropdowns

    return itemElement;
}

// Category deactivation functionality has been moved to category-manager.js

/**
 * Update an item's status in the data model
 * @param {string} itemId - The ID of the item to update
 * @param {string} newStatus - The new status value
 */
function updateItemStatus(itemId, newStatus) {
    // Update in categories
    window.menuData.categories.forEach(category => {
        const itemIndex = category.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            category.items[itemIndex].status = newStatus;
            console.log(`Updated status of item ${itemId} to ${newStatus} in category ${category.id}`);
        }
    });

    // Update in uncategorized items
    const uncatItemIndex = window.menuData.uncategorizedItems.findIndex(item => item.id === itemId);
    if (uncatItemIndex !== -1) {
        window.menuData.uncategorizedItems[uncatItemIndex].status = newStatus;
        console.log(`Updated status of uncategorized item ${itemId} to ${newStatus}`);
    }
}






// Add CSS for image preview
const style = document.createElement('style');
style.textContent = `
        .img-preview {
            max-width: 100%;
            max-height: 200px;
            border-radius: 6px;
            margin-bottom: 10px;
        }

        .item-image-upload.highlight {
            border-color: var(--primary-color);
            background-color: rgba(11, 94, 194, 0.05);
        }
    `;
document.head.appendChild(style);

/**
 * Category Manager
 * Handles category-related operations including deactivation and item management
 */



/**
 * Initialize the category manager functionality
 */
function initCategoryManager() {
    console.log('Category Manager initialized');

    // We no longer force Uncategorized Items to be closed
    // All categories can now be opened and closed by the user

    // Use event delegation for all menu interactions
    document.addEventListener('click', function (e) {
        // Handle kebab menu clicks for both categories and items
        if (e.target.closest('.menu-kebab') || e.target.matches('.menu-kebab img')) {
            e.stopPropagation(); // Stop event from bubbling up to parent elements
            e.preventDefault(); // Prevent default behavior
            console.log('Kebab menu clicked via delegation');

            // Find the kebab menu element
            const kebabMenu = e.target.closest('.menu-kebab');
            if (!kebabMenu) {
                console.error('Could not find kebab menu');
                return;
            }

            // Get the dropdown for this kebab menu
            const dropdown = kebabMenu.nextElementSibling;
            if (!dropdown) {
                console.error('Could not find dropdown for kebab menu');
                return;
            }

            console.log('Found dropdown:', dropdown);

            // Close all other dropdowns first
            document.querySelectorAll('.kebab-dropdown').forEach(d => {
                if (d !== dropdown) {
                    d.style.display = 'none';
                }
            });

            // Toggle this dropdown - use getComputedStyle to check actual visibility
            const displayStyle = window.getComputedStyle(dropdown).display;

            if (displayStyle === 'none') {
                // Unified positioning for mobile and desktop
                if (window.innerWidth <= 768) {
                    // Mobile: use fixed positioning
                    const rect = kebabMenu.getBoundingClientRect();
                    const windowWidth = window.innerWidth;
                    const menuWidth = 160; // Dropdown menü genişliği

                    dropdown.style.position = 'fixed';
                    dropdown.style.top = (rect.bottom + 5) + 'px';
                    dropdown.style.width = '160px';

                    // Ekranın ortasına göre kebab menünün konumunu kontrol et
                    if (rect.left > windowWidth / 2) {
                        // Kebab menü ekranın sağ tarafındaysa, dropdown'u sola hizala
                        dropdown.style.left = Math.max(10, rect.left - menuWidth + 30) + 'px';
                    } else {
                        // Kebab menü ekranın sol tarafındaysa, dropdown'u sağa hizala
                        dropdown.style.left = Math.max(10, rect.left - 100) + 'px';
                    }
                } else {
                    // Desktop: use absolute positioning (default CSS)
                    dropdown.style.position = '';
                    dropdown.style.top = '';
                    dropdown.style.left = '';
                    dropdown.style.width = '';
                }

                dropdown.style.display = 'block';
            } else {
                dropdown.style.display = 'none';
            }

            return false; // Prevent other handlers from firing
        }

        // Handle deactivate category option clicks
        if (e.target.classList.contains('deactivate-category') ||
            e.target.closest('.kebab-option.deactivate-category')) {
            e.stopPropagation();
            console.log('Deactivate category clicked via delegation');

            const deactivateOption = e.target.classList.contains('deactivate-category') ?
                e.target : e.target.closest('.kebab-option.deactivate-category');

            // Close the dropdown
            const dropdown = deactivateOption.closest('.kebab-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }

            // Store reference to the category being deactivated
            const categoryToDeactivate = deactivateOption.closest('.category-item');

            if (!categoryToDeactivate) {
                console.error('Could not find category to deactivate');
                return;
            }

            // Show the confirmation modal
            const deactivateCategoryModal = new bootstrap.Modal(document.getElementById('deactivateCategoryModal'));

            // Set up the confirm button to deactivate this category
            const confirmDeactivateBtn = document.getElementById('confirmDeactivateBtn');

            // Remove any existing event listeners
            const newConfirmBtn = confirmDeactivateBtn.cloneNode(true);
            confirmDeactivateBtn.parentNode.replaceChild(newConfirmBtn, confirmDeactivateBtn);

            // Add new event listener
            newConfirmBtn.addEventListener('click', function () {
                console.log('Confirm deactivate button clicked');
                deactivateCategoryAndReleaseItems(categoryToDeactivate);

                // Remove focus from the button before hiding the modal
                newConfirmBtn.blur();

                // Hide the modal
                deactivateCategoryModal.hide();

                // Ensure all modal backdrops are properly cleaned up
                setTimeout(() => {
                    const allBackdrops = document.querySelectorAll('.modal-backdrop');
                    allBackdrops.forEach(backdrop => {
                        backdrop.remove();
                    });
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, 300);
            });

            deactivateCategoryModal.show();
            console.log('Deactivate Category clicked for:', categoryToDeactivate.querySelector('.category-title').textContent);

            return; // Prevent other handlers from firing
        }

        // Handle remove item option clicks
        if (e.target.classList.contains('remove') ||
            e.target.closest('.kebab-option.remove')) {
            e.stopPropagation();
            console.log('Remove item clicked via delegation');

            const removeOption = e.target.classList.contains('remove') ?
                e.target : e.target.closest('.kebab-option.remove');

            const menuItemRow = removeOption.closest('.menu-item-row');
            if (!menuItemRow) {
                console.error('Could not find menu item to remove');
                return;
            }

            const itemId = menuItemRow.dataset.itemId;
            const itemName = menuItemRow.querySelector('.menu-item-name').textContent;
            const categoryItem = menuItemRow.closest('.category-item');
            const categoryId = categoryItem.dataset.categoryId;

            // Close dropdown
            const dropdown = removeOption.closest('.kebab-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }

            // Find the item in the data model and move it to uncategorizedItems
            let removedItem = null;
            let itemIndex = -1;

            // Find the category and item in the data model
            window.menuData.categories.forEach((category) => {
                if (category.id === categoryId) {
                    itemIndex = category.items.findIndex(item => item.id === itemId);
                    if (itemIndex !== -1) {
                        // Remove the item from the category
                        removedItem = category.items.splice(itemIndex, 1)[0];
                    }
                }
            });

            if (removedItem) {
                // Add the item to uncategorizedItems
                window.menuData.uncategorizedItems.push(removedItem);
                console.log(`Moved item ${itemId} from category ${categoryId} to uncategorized items`);
                console.log('Updated data model:', window.menuData);
            } else {
                console.error(`Could not find item ${itemId} in category ${categoryId}`);
            }

            // Add fade-out class for animation
            menuItemRow.classList.add('fade-out');

            // Wait for animation to complete before removing from DOM
            setTimeout(() => {
                // Remove the item from DOM
                menuItemRow.remove();

                // Update item count for the category
                updateCategoryItemCount(categoryItem);

                // Add the item to the Uncategorized Items section in the UI
                if (removedItem) {
                    // Find or create the Uncategorized Items category
                    let uncategorizedCategory = document.querySelector('.category-item[data-category-id="uncategorized"]');

                    if (uncategorizedCategory) {
                        // Find the items container
                        const uncategorizedItems = uncategorizedCategory.querySelector('.category-items');

                        if (uncategorizedItems) {
                            // Create a new item element
                            const newItemElement = createItemElement(removedItem);

                            // Add the item to the Uncategorized Items category
                            uncategorizedItems.appendChild(newItemElement);

                            // Make sure the Uncategorized Items category is visible
                            uncategorizedCategory.style.display = 'block';

                            // Update the item count for the Uncategorized Items category
                            updateCategoryItemCount(uncategorizedCategory);

                            // Add event listeners to the new item
                            addItemEventListeners(newItemElement);
                        }
                    }
                }

                // Show item removed toast notification
                showItemRemovedToast();

                // Check if we need to show empty state
                checkAndShowEmptyState();

                console.log(`Removed item: ${itemName} from category and moved to Uncategorized Items`);
            }, 300);

            return; // Prevent other handlers from firing
        }


    });

    // Add event listener to the "Add items" button in empty state
    const emptyStateButton = document.querySelector('.empty-state-button');
    if (emptyStateButton) {
        emptyStateButton.addEventListener('click', function () {
            // In a real app, this would open a form or modal to add new items
            console.log('Add items button clicked from empty state');
            showToast('Add Items', 'This feature is not implemented yet.');
        });
    }

    // Check for empty state on page load
    checkAndShowEmptyState();

    // Add event listener for edit item option clicks
    document.addEventListener('click', function (e) {
        if (e.target.textContent === 'Edit item' ||
            (e.target.closest('.kebab-option') && e.target.closest('.kebab-option').textContent.trim() === 'Edit item')) {
            e.stopPropagation();
            console.log('Edit item clicked');

            const editOption = e.target.textContent === 'Edit item' ?
                e.target : e.target.closest('.kebab-option');

            const menuItemRow = editOption.closest('.menu-item-row');
            if (!menuItemRow) {
                console.error('Could not find menu item to edit');
                return;
            }

            // Close dropdown
            const dropdown = editOption.closest('.kebab-dropdown');
            if (dropdown) {
                dropdown.style.display = 'none';
            }

            // Mark this item as being edited
            document.querySelectorAll('.menu-item-row').forEach(row => {
                row.classList.remove('currently-editing');
            });
            menuItemRow.classList.add('currently-editing');

        }
    });
}

/**
 * Deactivate and remove a category, making its items independent
 * @param {HTMLElement} categoryElement - The category element to deactivate and remove
 */
function deactivateCategoryAndReleaseItems(categoryElement) {
    console.log('Deactivating category...');

    // Get category name
    const categoryName = categoryElement.querySelector('.category-title').textContent;
    console.log('Category name:', categoryName);

    // Get all items in the category
    const categoryItems = categoryElement.querySelector('.category-items');
    if (!categoryItems) {
        console.error('Could not find category items container');
        return;
    }

    const menuItems = categoryItems.querySelectorAll('.menu-item-row');
    console.log('Found', menuItems.length, 'items in category');

    // We no longer need to create independent items container
    // Items will stay in their deactivated category and won't be shown independently

    // Get the category ID to update the data model
    const categoryId = categoryElement.dataset.categoryId;

    // Find the category in the data model
    const categoryIndex = window.menuData.categories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex !== -1) {
        // Get the category from the data model
        const category = window.menuData.categories[categoryIndex];

        // Update the category status to 'inactive'
        category.status = 'inactive';

        // NOT moving items to uncategorizedItems anymore
        // Items will stay in the deactivated category
        console.log('Category items will remain in the deactivated category');
    }

    // Add fade-out class to the category for animation
    categoryElement.classList.add('fade-out');

    // Wait for animation to complete before removing the category
    setTimeout(() => {
        // Remove the category from DOM
        categoryElement.remove();

        // Show toast notification
        showCategoryDeactivatedToast();

        // Check if we need to show the empty state
        checkAndShowEmptyState();

        console.log(`Deactivated and removed category: ${categoryName} and its ${menuItems.length} items from view`);

        // Log the updated data model
        console.log('Updated data model:', window.menuData);
    }, 300); // Match this with the CSS transition duration
}

/**
 * Check if we need to show the empty state message
 * Shows empty state only if there are no visible items AND no categories
 */
function checkAndShowEmptyState() {
    const menuCategories = document.querySelector('.menu-categories');
    const independentItemsContainer = document.querySelector('.independent-items-container');
    const emptyStateMessage = document.querySelector('.empty-state-message');
    const noteBanner = document.querySelector('#overviewNote');

    // Count visible items (both in categories and independent)
    let visibleItems = 0;

    // Count visible items in categories
    const categoryItems = document.querySelectorAll('.category-item .menu-item-row');
    visibleItems += Array.from(categoryItems).filter(item => item.style.display !== 'none').length;

    // Count visible independent items
    if (independentItemsContainer) {
        const independentItems = independentItemsContainer.querySelectorAll('.menu-item-row');
        visibleItems += Array.from(independentItems).filter(item => item.style.display !== 'none').length;
    }

    // Count categories
    const categories = document.querySelectorAll('.category-item');
    const categoriesCount = categories.length;
    if (categories) {
        // Update all category item counts to ensure they're accurate
        categories.forEach(category => {
            updateCategoryItemCount(category);
        });

        // Show empty state only if there are no visible items AND no categories
        if (visibleItems === 0 && categoriesCount === 0) {
            // Hide menu categories container
            if (menuCategories) {
                menuCategories.style.display = 'none';
            }

            // Hide independent items container
            if (independentItemsContainer) {
                independentItemsContainer.style.display = 'none';
            }

            // Hide note banner when showing empty state
            if (noteBanner) {
                noteBanner.style.display = 'none';
            }

            // Show empty state message
            if (emptyStateMessage) {
                emptyStateMessage.style.display = 'flex';
            }
        }
        else {
            // Show menu categories container if there are categories
            if (menuCategories && categoriesCount > 0) {
                menuCategories.style.display = 'block';
            }

            // Show independent items container if it exists and has visible items
            if (independentItemsContainer && Array.from(independentItemsContainer.querySelectorAll('.menu-item-row'))
                .filter(item => item.style.display !== 'none').length > 0) {
                independentItemsContainer.style.display = 'block';
            }

            // Show note banner when not showing empty state
            if (noteBanner) {
                noteBanner.style.display = 'block';
            }

            // Hide empty state message
            if (emptyStateMessage) {
                emptyStateMessage.style.display = 'none';
            }
        }
    }

}

/**
 * Add event listeners to a category element
 * This function is kept for documentation purposes but all functionality
 * is now handled by event delegation in script.js and initCategoryManager
 */
function addCategoryEventListeners() {
    // Toggle functionality is now handled by event delegation in script.js

    // Kebab menu functionality is now handled by event delegation in initCategoryManager

    // Deactivate option functionality is now handled by event delegation in initCategoryManager
}

/**
 * Create a menu item element from item data
 * @param {Object} item - The item data
 * @param {boolean} [isInUncategorizedSection=false] - Whether this item is being rendered in the Uncategorized Items section
 * @returns {HTMLElement} - The item element
 */
function createItemElement(item, isInUncategorizedSection = false) {
    const itemElement = document.createElement('div');
    itemElement.className = 'menu-item-row';
    itemElement.dataset.itemId = item.id;

    // Set display style based on status
    if (item.status === 'hidden') {
        itemElement.style.display = 'none';
    }

    // Create drag handle
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '<img src="images/icons/drag-handle.svg" alt="Drag">';

    // Create item image or placeholder
    let itemImageContainer;
    if (item.image) {
        itemImageContainer = document.createElement('div');
        itemImageContainer.className = 'menu-item-image';
        itemImageContainer.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
    } else {
        itemImageContainer = document.createElement('div');
        itemImageContainer.className = 'menu-item-image-placeholder';
        itemImageContainer.innerHTML = '<img src="images/icons/image-icon.svg" alt="image-icon">';
    }

    // Create item details
    const itemDetails = document.createElement('div');
    itemDetails.className = 'menu-item-details';

    const itemName = document.createElement('div');
    itemName.className = 'menu-item-name';
    itemName.textContent = item.name;

    const itemPrice = document.createElement('div');
    itemPrice.className = 'menu-item-price';
    itemPrice.textContent = item.price;

    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPrice);

    // Create item status container
    const statusContainer = document.createElement('div');
    statusContainer.className = 'menu-item-status-container';

    const statusDisplay = document.createElement('div');
    statusDisplay.className = `menu-item-status ${item.status}`;

    // Create status icon based on status
    let statusIconSrc;
    if (item.status === 'available') {
        statusIconSrc = 'images/icons/status-dot-available.svg';
    } else if (item.status === 'out-of-stock') {
        statusIconSrc = 'images/icons/status-dot-out-of-stock.svg';
    } else if (item.status === 'hidden') {
        statusIconSrc = 'images/icons/hidden-icon.svg';
    }

    statusDisplay.innerHTML = `
        <img src="${statusIconSrc}" alt="${item.status}" class="status-icon">
        <span>${item.status.replace('-', ' ')}</span>
        <img src="images/icons/chevron-down.svg" alt="Toggle" class="status-toggle">
    `;

    // Create status dropdown
    const statusDropdown = document.createElement('div');
    statusDropdown.className = 'status-dropdown';
    statusDropdown.innerHTML = `
        <div class="status-option" data-value="available">
            <img src="images/icons/status-dot-available.svg" alt="Available" class="status-icon">
            Available
        </div>
        <div class="status-option" data-value="out-of-stock">
            <img src="images/icons/status-dot-out-of-stock.svg" alt="Out of Stock" class="status-icon">
            Out of Stock
        </div>
        <div class="status-option" data-value="hidden">
            <img src="images/icons/hidden-icon.svg" alt="Hidden" class="status-icon">
            Hidden
        </div>
    `;

    statusContainer.appendChild(statusDisplay);
    statusContainer.appendChild(statusDropdown);

    // Create item actions
    const itemActions = document.createElement('div');
    itemActions.className = 'menu-item-actions';

    const itemKebab = document.createElement('div');
    itemKebab.className = 'menu-kebab';
    itemKebab.innerHTML = '<img src="images/icons/menu-kebab-horizontal.svg" alt="Menu">';

    const itemDropdown = document.createElement('div');
    itemDropdown.className = 'kebab-dropdown';

    // Determine if this is an uncategorized item
    // Check both the data model and whether it's being rendered in the Uncategorized Items section
    const isUncategorized = isInUncategorizedSection || window.menuData.uncategorizedItems.some(uncatItem => uncatItem.id === item.id);

    if (isUncategorized) {
        // For uncategorized items, only show the Edit option
        itemDropdown.innerHTML = '<div class="kebab-option">Edit item</div>';
    } else {
        // For categorized items, show both Edit and Remove options
        itemDropdown.innerHTML = `
            <div class="kebab-option">Edit item</div>
            <div class="kebab-option remove">Remove from category</div>
        `;
    }

    itemActions.appendChild(itemKebab);
    itemActions.appendChild(itemDropdown);

    // Assemble item element
    itemElement.appendChild(dragHandle);
    itemElement.appendChild(itemImageContainer);
    itemElement.appendChild(itemDetails);
    itemElement.appendChild(statusContainer);
    itemElement.appendChild(itemActions);

    return itemElement;
}

/**
 * Add event listeners to a menu item element
 * This function is kept for documentation purposes but all functionality
 * is now handled by event delegation in script.js and initCategoryManager
 */
function addItemEventListeners() {
    // We don't need to add direct event listeners here for status dropdown functionality
    // The global event delegation in script.js will handle status dropdown toggling

    // We also don't need to add direct event listeners for status options
    // The global event delegation in script.js will handle status option selection

    // Kebab menu functionality is now handled by event delegation in initCategoryManager

    // Note: Remove option functionality is now handled by event delegation in initCategoryManager
}

// toggleCategoryItems function has been moved to script.js

/**
 * Update category item count and check if empty message should be shown
 * @param {HTMLElement} categoryItem - The category element to update
 */
function updateCategoryItemCount(categoryItem) {
    if (!categoryItem) return;

    const visibleItems = Array.from(categoryItem.querySelectorAll('.menu-item-row'))
        .filter(item => item.style.display !== 'none');

    const itemCountElement = categoryItem.querySelector('.item-count');
    if (itemCountElement) {
        itemCountElement.textContent = `${visibleItems.length} items`;
    }

    // Check if category is empty and show/hide empty message accordingly
    const categoryItems = categoryItem.querySelector('.category-items');
    if (categoryItems) {
        // Check if there are any visible items
        if (visibleItems.length === 0) {
            // Check if empty message already exists
            let emptyMessage = categoryItems.querySelector('.empty-category-message');
            if (!emptyMessage) {
                // Create and add empty message
                emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-category-message';
                emptyMessage.textContent = 'No items added to this category yet.';
                categoryItems.appendChild(emptyMessage);
            }
        } else {
            // Remove empty message if it exists
            const emptyMessage = categoryItems.querySelector('.empty-category-message');
            if (emptyMessage) {
                emptyMessage.remove();
            }
        }
    }
}

/**
 * Show a toast notification for category deactivation
 */
function showCategoryDeactivatedToast() {
    // Use the existing toast container from the HTML
    let toastContainer = document.querySelector('.custom-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'custom-toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Clear any existing toasts
    toastContainer.innerHTML = '';

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast category-deactivated';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Create toast content
    toastElement.innerHTML = `
        <div class="toast-header">
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="success-icon">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="toast-message">Category deactivated</div>
            <div class="close-icon">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Add click event to close icon
    const closeIcon = toastElement.querySelector('.close-icon');
    closeIcon.addEventListener('click', function () {
        const bsToast = bootstrap.Toast.getInstance(toastElement);
        bsToast.hide();
    });

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    // Add hide event listener for smooth animation
    toastElement.addEventListener('hide.bs.toast', function () {
        toastElement.classList.remove('show');
        toastElement.classList.add('hide');
    });

    // Trigger right-to-left slide animation
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 10);

    // Show toast
    toast.show();
}

/**
 * Show a toast notification for item hidden
 */
function showItemHiddenToast() {
    // Use the existing toast container from the HTML
    let toastContainer = document.querySelector('.custom-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'custom-toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Clear any existing toasts
    toastContainer.innerHTML = '';

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast item-hidden';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Create toast content
    toastElement.innerHTML = `
        <div class="toast-header">
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="hidden-icon">
                <i class="fa-solid fa-eye-slash"></i>
            </div>
            <div class="toast-message">Item hidden from public profile.</div>
            <div class="close-icon">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Add click event to close icon
    const closeIcon = toastElement.querySelector('.close-icon');
    closeIcon.addEventListener('click', function () {
        const bsToast = bootstrap.Toast.getInstance(toastElement);
        bsToast.hide();
    });

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    // Add hide event listener for smooth animation
    toastElement.addEventListener('hide.bs.toast', function () {
        toastElement.classList.remove('show');
        toastElement.classList.add('hide');
    });

    // Trigger right-to-left slide animation
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 10);

    // Show toast
    toast.show();
}

/**
 * Show a toast notification for item removed
 */
function showItemRemovedToast() {
    // Use the existing toast container from the HTML
    let toastContainer = document.querySelector('.custom-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'custom-toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Clear any existing toasts
    toastContainer.innerHTML = '';

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast item-removed';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Create toast content
    toastElement.innerHTML = `
        <div class="toast-header">
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="success-icon ellipse-253">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="toast-message">Item moved to Uncategorized Items.</div>
            <div class="close-icon">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Add click event to close icon
    const closeIcon = toastElement.querySelector('.close-icon');
    closeIcon.addEventListener('click', function () {
        const bsToast = bootstrap.Toast.getInstance(toastElement);
        bsToast.hide();
    });

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    // Add hide event listener for smooth animation
    toastElement.addEventListener('hide.bs.toast', function () {
        toastElement.classList.remove('show');
        toastElement.classList.add('hide');
    });

    // Trigger right-to-left slide animation
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 10);

    // Show toast
    toast.show();
}

/**
 * Show a toast notification for item marked as out of stock
 */
function showItemOutOfStockToast() {
    // Use the existing toast container from the HTML
    let toastContainer = document.querySelector('.custom-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'custom-toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Clear any existing toasts
    toastContainer.innerHTML = '';

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast item-out-of-stock';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Create toast content
    toastElement.innerHTML = `
        <div class="toast-header">
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="out-of-stock-icon">
                <div class="exclamation-mark"></div>
            </div>
            <div class="toast-message">Item marked as out of stock.</div>
            <div class="close-icon">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Add click event to close icon
    const closeIcon = toastElement.querySelector('.close-icon');
    closeIcon.addEventListener('click', function () {
        const bsToast = bootstrap.Toast.getInstance(toastElement);
        bsToast.hide();
    });

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    // Add hide event listener for smooth animation
    toastElement.addEventListener('hide.bs.toast', function () {
        toastElement.classList.remove('show');
        toastElement.classList.add('hide');
    });

    // Trigger right-to-left slide animation
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 10);

    // Show toast
    toast.show();
}

/**
 * Show a toast notification for item marked as available
 */
function showItemAvailableToast() {
    // Use the existing toast container from the HTML
    let toastContainer = document.querySelector('.custom-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'custom-toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Clear any existing toasts
    toastContainer.innerHTML = '';

    // Create toast element
    const toastElement = document.createElement('div');
    toastElement.className = 'toast item-available';
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    // Create toast content
    toastElement.innerHTML = `
        <div class="toast-header">
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            <div class="success-icon ellipse-253">
                <i class="fa-solid fa-check"></i>
            </div>
            <div class="toast-message">Item is now available to customers. </div>
            <div class="close-icon">
                <i class="fa-solid fa-xmark"></i>
            </div>
        </div>
    `;

    // Add toast to container
    toastContainer.appendChild(toastElement);

    // Add click event to close icon
    const closeIcon = toastElement.querySelector('.close-icon');
    closeIcon.addEventListener('click', function () {
        const bsToast = bootstrap.Toast.getInstance(toastElement);
        bsToast.hide();
    });

    // Initialize Bootstrap toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    // Add hide event listener for smooth animation
    toastElement.addEventListener('hide.bs.toast', function () {
        toastElement.classList.remove('show');
        toastElement.classList.add('hide');
    });

    // Trigger right-to-left slide animation
    setTimeout(() => {
        toastElement.classList.add('show');
    }, 10);

    // Show toast
    toast.show();
}

/**
 * Initialize drag-and-drop functionality for independent items
 */
function initIndependentItemsDragAndDrop() {
    console.log('Initializing drag-and-drop for independent items');

    // Get the independent items container
    const independentItemsContainer = document.querySelector('.independent-items-container');
    if (!independentItemsContainer) {
        console.error('Could not find independent items container');
        return;
    }

    // Get all menu items in the independent container
    const menuItemRows = independentItemsContainer.querySelectorAll('.menu-item-row');
    console.log('Found', menuItemRows.length, 'independent items to make draggable');

    // Make menu items draggable
    menuItemRows.forEach(row => {
        const dragHandle = row.querySelector('.drag-handle');

        if (dragHandle) {
            // Remove any existing event listeners
            const newDragHandle = dragHandle.cloneNode(true);
            dragHandle.parentNode.replaceChild(newDragHandle, dragHandle);

            // Mouse events for desktop
            newDragHandle.addEventListener('mousedown', function (e) {
                handleItemDragStart(e, row, false);
            });

            // Touch events for mobile
            newDragHandle.addEventListener('touchstart', function (e) {
                handleItemDragStart(e, row, true);
            });

            function handleItemDragStart(e, row, isTouch) {
                // Prevent default to avoid text selection during drag
                e.preventDefault();
                // Stop propagation to prevent row click
                e.stopPropagation();

                // Flag to track if we're actually dragging or just clicking
                let isDragging = false;

                // Add dragging class with a slight delay for smooth transition
                setTimeout(() => {
                    row.classList.add('dragging');
                }, 10);

                // Set up move and end events based on device type
                if (isTouch) {
                    document.addEventListener('touchmove', moveItemTouch);
                    document.addEventListener('touchend', endItemDragTouch);
                    document.addEventListener('touchcancel', endItemDragTouch);
                } else {
                    document.addEventListener('mousemove', moveItem);
                    document.addEventListener('mouseup', endItemDrag);
                }

                // Store initial position
                const initialY = isTouch ? e.touches[0].clientY : e.clientY;
                const menuItemRows = Array.from(independentItemsContainer.querySelectorAll('.menu-item-row'));
                const initialIndex = menuItemRows.indexOf(row);

                // Mouse move handler
                function moveItem(e) {
                    handleItemMove(e.clientY);
                }

                // Touch move handler
                function moveItemTouch(e) {
                    if (e.touches.length > 0) {
                        handleItemMove(e.touches[0].clientY);
                    }
                }

                // Common move logic
                function handleItemMove(clientY) {
                    // Set dragging flag to true once we've moved a bit
                    if (Math.abs(clientY - initialY) > 5) {
                        isDragging = true;
                    }

                    if (!isDragging) return;

                    // Find the item we're hovering over
                    const hoverItem = menuItemRows.find(item => {
                        if (item === row) return false;

                        const rect = item.getBoundingClientRect();
                        return clientY > rect.top && clientY < rect.bottom;
                    });

                    if (hoverItem) {
                        const hoverIndex = menuItemRows.indexOf(hoverItem);

                        // Reorder in the DOM
                        if (hoverIndex < initialIndex) {
                            independentItemsContainer.insertBefore(row, hoverItem);
                        } else {
                            independentItemsContainer.insertBefore(row, hoverItem.nextSibling);
                        }

                        // In a real app, you would update the order in your data structure
                        console.log(`Moved independent item ${row.querySelector('.menu-item-name').textContent} to position ${hoverIndex}`);
                    }
                }

                // Mouse end handler
                function endItemDrag() {
                    handleItemDragEnd();
                    document.removeEventListener('mousemove', moveItem);
                    document.removeEventListener('mouseup', endItemDrag);
                }

                // Touch end handler
                function endItemDragTouch() {
                    handleItemDragEnd();
                    document.removeEventListener('touchmove', moveItemTouch);
                    document.removeEventListener('touchend', endItemDragTouch);
                    document.removeEventListener('touchcancel', endItemDragTouch);
                }

                // Common end logic
                function handleItemDragEnd() {
                    // Remove dragging class with a smooth transition
                    if (isDragging) {
                        // First, add a class for transition out
                        row.classList.add('drag-ending');

                        // Then remove the dragging class after a short delay
                        setTimeout(() => {
                            row.classList.remove('dragging');
                            row.classList.remove('drag-ending');
                        }, 150);
                    } else {
                        // If not actually dragged, just remove the class
                        row.classList.remove('dragging');
                    }
                }
            }

            console.log('Added drag-and-drop to independent item:', row.querySelector('.menu-item-name').textContent);
        }
    });
}

// ------------------------------

/**
   * This script handles the behavior of multiple custom dropdown components on the page.
   * 
   *  Functionality Overview:
   * - Only one dropdown can be open at any time.
   * - Clicking on a dropdown button toggles that specific dropdown.
   * - If another dropdown is already open, it will be closed first.
   * - Clicking anywhere outside will close any open dropdown.
   
   */

let currentOpenDropdown = null; // Stores the currently open dropdown container

// Loop through all dropdown components
document.querySelectorAll('.aadi-dropdown-component').forEach(container => {
    const button = container.querySelector('.aadi-dropdown-button'); // Dropdown toggle button
    const menu = container.querySelector('.aadi-dropdown-menu');     // Dropdown menu to show/hide

    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling up and closing the dropdown immediately

        // Close any other dropdown that might be open
        if (currentOpenDropdown && currentOpenDropdown !== container) {
            currentOpenDropdown.classList.remove('open');
            currentOpenDropdown.querySelector('.aadi-dropdown-menu').style.display = 'none';
        }

        // Toggle the visibility of the clicked dropdown
        const isOpen = container.classList.toggle('open'); // Add/remove 'open' class
        menu.style.display = isOpen ? 'block' : 'none';    // Show/hide the menu

        // Update the current open dropdown tracker
        currentOpenDropdown = isOpen ? container : null;
    });
});

// Close the dropdown when clicking outside of any dropdown component
document.addEventListener('click', () => {
    if (currentOpenDropdown) {
        currentOpenDropdown.classList.remove('open');
        currentOpenDropdown.querySelector('.aadi-dropdown-menu').style.display = 'none';
        currentOpenDropdown = null;
    }
});


//   ---------------------------

/**
  * This script handles the accordion behavior for elements with the `.aadi-accordion-component` class.
  * 
  * Features:
  * - Smooth expand/collapse animation using `max-height` (CSS transition).
  * - Optional support to only allow one accordion open at a time (currently commented).
  * - Rotates toggle icon for visual indication.

  */

document.querySelectorAll('.aadi-accordion-component').forEach(container => {
    const header = container.querySelector('.aadi-accordion-header');   // Clickable header
    const content = container.querySelector('.aadi-accordion-content'); // Hidden/visible content
    const toggleIcon = container.querySelector('.aadi-accordion-toggle-icon'); // Optional arrow icon

    header.addEventListener('click', () => {
        const isExpanding = !container.classList.contains('expanded');

        //  Optional: Collapse all other accordions
        // document.querySelectorAll('.aadi-accordion-component').forEach(acc => {
        //   if (acc !== container) {
        //     acc.classList.remove('expanded');
        //     const otherContent = acc.querySelector('.aadi-accordion-content');
        //     otherContent.style.maxHeight = '0';
        //     setTimeout(() => {
        //       otherContent.style.display = 'none';
        //     }, 300);
        //     const otherIcon = acc.querySelector('.aadi-accordion-toggle-icon');
        //     if (otherIcon) otherIcon.style.transform = 'rotate(0)';
        //   }
        // });

        container.classList.toggle('expanded', isExpanding);

        if (isExpanding) {
            // Expand accordion
            content.style.display = 'block';                    // Ensure it's visible before measuring
            const height = content.scrollHeight;                // Get full height of content
            content.style.maxHeight = `${height}px`;            // Set max-height for transition
        } else {
            // Collapse accordion
            content.style.maxHeight = '0';                      // Animate collapse
            setTimeout(() => {
                if (!container.classList.contains('expanded')) {
                    content.style.display = 'none';                 // Fully hide after animation ends
                }
            }, 300); // Matches CSS transition duration
        }

        //  Rotate icon
        if (toggleIcon) {
            toggleIcon.style.transform = isExpanding ? 'rotate(180deg)' : 'rotate(0)';
        }
    });
});


//   ---------------------


// ----------- updated code ends here

// ----------------------pre


// Function to format date as MM/DD/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    // Return in desired format (e.g., "MM/DD/YYYY" or "DD-MM-YYYY")
    return `${day}/${month}/${year}`; // Change this to `${day}-${month}-${year}` if you prefer "DD-MM-YYYY"
}

// Function to delete selected item
function deleteSelectedItem(targetId, itemValue) {
    var targetContainer = $(targetId);

    // Remove the item from the target container
    targetContainer.find('div.tag-item').each(function () {
        var currentItem = $(this);
        if (currentItem.find('p').text() === itemValue) {
            currentItem.remove();
        }
    });
}

// Event listener for delete button
$('.tag-Items').on('click', '.delete_icon', function () {
    var selectedItemValue = $(this).siblings('p').text();

    // Delete item from selected provinces
    deleteSelectedItem('#selectedProvinces', selectedItemValue);

    // Delete item from selected regions
    deleteSelectedItem('#selectedRegions', selectedItemValue);

    deleteSelectedItem('#selectedCountries', selectedItemValue);
});


// -----


/* ------ Function to hide a container when a specific element within it is clicked. ---- */
function hideContainerOnClick(containerSelector, closeButtonSelector) {
    // Attach a click event handler to the document
    $(containerSelector).on('click', closeButtonSelector, function () {
        // Hide the container when the close button is clicked
        $(containerSelector).hide();
    });
}

/**
 * Retrieves the values of all checked checkboxes within a specified group.
 * @param {string} groupName - The name attribute value of the checkbox group.
 * @returns {Array} - An array containing the values of the checked checkboxes.
 */
function getCheckedCheckboxes(groupName) {
    var checkedCheckboxes = [];
    // Iterate over each checkbox group with the specified name
    $('input[type="checkbox"][name="' + groupName + '"]').each(function () {
        // Check if the current checkbox is checked
        if ($(this).prop('checked')) {
            // If checked, add its value to the array
            checkedCheckboxes.push($(this).val());
        }
    });

    // Return the array containing the values of the checked checkboxes
    return checkedCheckboxes;
}

/**
 * Initializes clear icon functionality for input fields.
 * @param {string} inputSelector - The selector for the input field.
 * @param {string} clearIconSelector - The selector for the clear icon.
 */
function initializeClearIcon(inputSelector, clearIconSelector) {
    var $searchInput = $(inputSelector);
    var $clearIcon = $(clearIconSelector);

    // Show/hide clear icon based on input value
    $searchInput.on('input', function () {
        if ($(this).val().trim() !== '') {
            $clearIcon.css('display', 'block');
        } else {
            $clearIcon.css('display', 'none');
        }
    });

    // Clear input value when clear icon is clicked
    $clearIcon.on('click', function () {
        $searchInput.val('');
        $clearIcon.css('display', 'none');
        $searchInput.siblings('label').removeClass('active');
    });
}



// plaza-list-overlay js
$(".filter_btn").click(function (e) {
    $('.filters_sidebar').addClass('showSidebar');
    // $('.overlay__').addClass('overlay_active');
    document.getElementById('overlay_').classList.add('overlay_active');
    document.body.classList.add('no-scroll');

});
$(".close_sidebar").click(function (e) {
    $('.filters_sidebar').removeClass('showSidebar');
    $('.overlay__').removeClass('overlay_active');
    document.body.classList.remove('no-scroll');

});
$("#overlay_").click(function (e) {
    $('.filters_sidebar').removeClass('showSidebar');
    $('.overlay__').removeClass('overlay_active');
    document.body.classList.remove('no-scroll');

});
window.addEventListener('resize', function () {
    if (window.innerWidth >= 767) {
        $('.filters_sidebar').removeClass('showSidebar');
        document.body.classList.remove('no-scroll');
        $('.overlay__').removeClass('overlay_active');
    }
});

$('.dropdown-toggle').on('click', function (e) {
    e.stopPropagation();
    e.preventDefault();

    var self = $(this);
    if (self.is('.disabled, :disabled')) {
        return false;
    }
    self.parent().toggleClass("open");
});

$(document).on('click', function (e) {
    if ($('.dropdown').hasClass('open')) {
        $('.dropdown').removeClass('open');
    }
});

$('.nav-btn.nav-slider').on('click', function () {
    $('.overlay').show();
    $('nav').toggleClass("open");
    if ($('div').hasClass('bar-visible')) {
        $('div').removeClass('bar-visible');
    }
});

$('.overlay').on('click', function () {
    if ($('nav').hasClass('open')) {
        $('nav').removeClass('open');
    }
    $(this).hide();
});

$('.switch').on('click', function (e) {
    $('#sidebarMenu').toggleClass("bar-visible"); //you can list several class names 
    if ($('nav').hasClass('open')) {
        $('nav').removeClass('open');
    }

    e.preventDefault();
});


$.each($('.radio-btn'), function (key, value) {
    $(this).click(function (e) {
        $('.radio-btn-selected')
            .removeClass('radio-btn-selected')
            .addClass('radio-btn');

        $(this)
            .removeClass('radio-btn')
            .addClass('radio-btn-selected');

        //do whatever you want on click
    });
});


function getVals() {
    // Get slider values
    let parent = this.parentNode;
    let slides = parent.getElementsByTagName("input");
    let slide1 = parseFloat(slides[0].value);
    let slide2 = parseFloat(slides[1].value);
    // Neither slider will clip the other, so make sure we determine which is larger
    if (slide1 > slide2) { let tmp = slide2; slide2 = slide1; slide1 = tmp; }

    let displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = "$" + slide1 + " - $" + slide2;
}

window.onload = function () {
    // Initialize Sliders
    let sliderSections = document.getElementsByClassName("range-slider");
    for (let x = 0; x < sliderSections.length; x++) {
        let sliders = sliderSections[x].getElementsByTagName("input");
        for (let y = 0; y < sliders.length; y++) {
            if (sliders[y].type === "range") {
                sliders[y].oninput = getVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
            }
        }
    }
}










// ----------------------Pre


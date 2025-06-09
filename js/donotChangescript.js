 /* 🚫 Do not modify this file  */


// Data model for categories and items
window.menuData = {
    categories: [
        {
            id: 'drinks',
            title: 'Drinks',
            status: 'active',
            order: 1,
            items: [
                {
                    id: 'margherita-pizza',
                    name: 'Margherita Pizza',
                    price: '$12.99',
                    status: 'available',
                    image: 'images/margherita-pizza.jpg'
                },
                {
                    id: 'chicken-wings',
                    name: 'Chicken Wings',
                    price: '$12.99',
                    status: 'out-of-stock',
                    image: null
                }
            ]
        },
        {
            id: 'salads',
            title: 'Salads',
            status: 'active',
            order: 2,
            items: []
        }
    ],
    uncategorizedItems: [
        {
            id: 'french-fries',
            name: 'French Fries',
            price: '$5.99',
            status: 'available',
            image: null
        },
        {
            id: 'garlic-bread',
            name: 'Garlic Bread',
            price: '$4.99',
            status: 'available',
            image: null
        },
        {
            id: 'onion-rings',
            name: 'Onion Rings',
            price: '$6.99',
            status: 'hidden',
            image: null
        },
        {
            id: 'mozzarella-sticks',
            name: 'Mozzarella Sticks with Extra Long Name That Should Be Truncated',
            price: '$7.99',
            status: 'out-of-stock',
            image: null
        }
    ]
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Function to clean up modal backdrop if it gets stuck
    function cleanupModalBackdrop() {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop:not(.preserve-backdrop)');
        modalBackdrops.forEach(backdrop => {
            backdrop.remove();
        });

        // Remove the preserve-backdrop class from any backdrops that have it
        const preservedBackdrops = document.querySelectorAll('.modal-backdrop.preserve-backdrop');
        preservedBackdrops.forEach(backdrop => {
            backdrop.classList.remove('preserve-backdrop');
        });

        // Only remove modal-open class if no modals are visible
        if (!document.querySelector('.modal.show')) {
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
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
            if (scrollTop > lastScrollTop && scrollTop > 60) {
                // Add compact class to header
                header.classList.add('header-compact');
            }
            // If scrolling up
            else if (scrollTop < lastScrollTop) {
                // Remove compact class from header
                header.classList.remove('header-compact');
            }

            // If at the top of the page, always show header
            if (scrollTop <= 10) {
                header.classList.remove('header-compact');
            }

            lastScrollTop = scrollTop;
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', function() {
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
    window.addEventListener('resize', function() {
        // Reset header state on resize
        if (window.innerWidth > 768) {
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
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Here you would typically show/hide content based on the selected tab
            console.log('Tab clicked:', this.textContent.trim());
        });
    });

    // Search functionality for the header search
    const headerSearchInput = document.querySelector('.search-box input');
    const headerSearchContainer = document.querySelector('.search-box');
    const headerClearIcon = document.querySelector('.search-box .clear-icon');

    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', function() {
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

        headerSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase();
                console.log('Performing search for:', searchTerm);
                // Prevent form submission if within a form
                e.preventDefault();
            }
        });

        // Add click event for the clear icon
        if (headerClearIcon) {
            headerClearIcon.addEventListener('click', function() {
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
        menuSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterMenuItems(searchTerm);

            // Show/hide clear icon based on input content
            if (this.value.length > 0) {
                searchContainer.classList.add('has-text');
            } else {
                searchContainer.classList.remove('has-text');
            }
        });

        menuSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase();
                filterMenuItems(searchTerm);
                // Prevent form submission if within a form
                e.preventDefault();
            }
        });

        // Add click event for the clear icon
        if (clearIcon) {
            clearIcon.addEventListener('click', function() {
                menuSearchInput.value = '';
                searchContainer.classList.remove('has-text');
                resetUIState();
            });
        }
    }

    // Clear filter functionality
    if (clearFilterButton) {
        clearFilterButton.addEventListener('click', function() {
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
            nameElement.innerHTML = nameElement.textContent;
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
            const noteBanner = document.querySelector('.note-banner');
            if (noteBanner) {
                noteBanner.style.display = 'none';
            }
        } else {
            // Show the note banner
            const noteBanner = document.querySelector('.note-banner');
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
        const noteBanner = document.querySelector('.note-banner');
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
                overlay.addEventListener('click', function() {
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

    // Update button visibility on page load and resize
    updateOpenSidebarButtonVisibility();
    window.addEventListener('resize', updateOpenSidebarButtonVisibility);




    // Make header icons interactive
    const headerIcons = document.querySelectorAll('.header-icons .icon-item');

    headerIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Header icon clicked:', this.querySelector('i').className);
        });
    });

    // Use event delegation for category toggling
    document.addEventListener('click', function(e) {
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
        row.addEventListener('click', function(e) {
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
    document.addEventListener('click', function(e) {
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
                    statusIconSrc = 'images/status-dot-available.svg';
                    statusDisplay.classList.remove('out-of-stock-style', 'hidden-style');
                } else if (newStatus === 'out-of-stock') {
                    statusIconSrc = 'images/status-dot-out-of-stock.svg';
                    statusDisplay.classList.remove('hidden-style');
                    statusDisplay.classList.add('out-of-stock-style');
                } else if (newStatus === 'hidden') {
                    statusIconSrc = 'images/hidden-icon.svg';
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

    document.addEventListener('click', function(e) {
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
                dragHandle.addEventListener('mousedown', function(e) {
                    handleCategoryDragStart(e, item, false);
                });

                // Touch events for mobile
                dragHandle.addEventListener('touchstart', function(e) {
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
                dragHandle.addEventListener('mousedown', function(e) {
                    handleItemDragStart(e, row, false);
                });

                // Touch events for mobile
                dragHandle.addEventListener('touchstart', function(e) {
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

    // Render the menu from data
    renderMenu();

    // Initialize drag and drop functionality after rendering the menu
    initDragAndDrop();

    // Initialize the UI on page load
    resetUIState();

    // Check for empty state if the function exists in category-manager.js
    if (typeof checkAndShowEmptyState === 'function') {
        // Wait a bit to ensure all DOM updates are complete
        setTimeout(checkAndShowEmptyState, 100);
    }

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
        dragHandle.innerHTML = '<img src="images/drag-handle.svg" alt="Drag">';

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
        menuKebab.innerHTML = '<img src="images/menu-kebab.svg" alt="Menu">';

        const kebabDropdown = document.createElement('div');
        kebabDropdown.className = 'kebab-dropdown category-kebab-dropdown';
        kebabDropdown.innerHTML = '<div class="kebab-option deactivate-category">Deactivate Category</div>';

        const toggleIcon = document.createElement('div');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.innerHTML = '<img src="images/chevron-down.svg" alt="Toggle">';

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
        dragHandle.innerHTML = '<img src="images/drag-handle.svg" alt="Drag">';

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
        menuKebab.innerHTML = '<img src="images/menu-kebab.svg" alt="Menu">';

        const kebabDropdown = document.createElement('div');
        kebabDropdown.className = 'kebab-dropdown category-kebab-dropdown';
        kebabDropdown.innerHTML = '<div class="kebab-option deactivate-category">Deactivate Category</div>';

        const toggleIcon = document.createElement('div');
        toggleIcon.className = 'toggle-icon';
        toggleIcon.innerHTML = '<img src="images/chevron-down.svg" alt="Toggle">';

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
        dragHandle.innerHTML = '<img src="images/drag-handle.svg" alt="Drag">';

        // Create item image or placeholder
        let itemImageContainer;
        if (item.image) {
            itemImageContainer = document.createElement('div');
            itemImageContainer.className = 'menu-item-image';
            itemImageContainer.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
        } else {
            itemImageContainer = document.createElement('div');
            itemImageContainer.className = 'menu-item-image-placeholder';
            itemImageContainer.innerHTML = '<i class="fa-regular fa-image"></i>';
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
            statusIconSrc = 'images/status-dot-available.svg';
        } else if (item.status === 'out-of-stock') {
            statusIconSrc = 'images/status-dot-out-of-stock.svg';
        } else if (item.status === 'hidden') {
            statusIconSrc = 'images/hidden-icon.svg';
        }

        statusDisplay.innerHTML = `
            <img src="${statusIconSrc}" alt="${item.status}" class="status-icon">
            <span>${item.status.replace('-', ' ')}</span>
            <img src="images/chevron-down.svg" alt="Toggle" class="status-toggle">
        `;

        // Create status dropdown
        const statusDropdown = document.createElement('div');
        statusDropdown.className = 'status-dropdown';
        statusDropdown.innerHTML = `
            <div class="status-option" data-value="available">
                <img src="images/status-dot-available.svg" alt="Available" class="status-icon">
                Available
            </div>
            <div class="status-option" data-value="out-of-stock">
                <img src="images/status-dot-out-of-stock.svg" alt="Out of Stock" class="status-icon">
                Out of Stock
            </div>
            <div class="status-option" data-value="hidden">
                <img src="images/hidden-icon.svg" alt="Hidden" class="status-icon">
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
        itemKebab.innerHTML = '<img src="images/menu-kebab.svg" alt="Menu">';

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

    // Edit Item Modal Functionality
    const editItemOptions = document.querySelectorAll('.kebab-option:not(.remove):not(.deactivate-category)');
    const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));

    // Add click event listeners to all "Edit item" options in kebab menus
    editItemOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove focus from any buttons before showing the modal
            document.querySelectorAll('button').forEach(button => button.blur());

            // Show the modal
            editItemModal.show();
        });
    });

    // We'll use a simpler approach with Bootstrap's data-bs-dismiss attribute
    // This is already added to the save button in HTML

    // Add event listeners to ensure modal cleanup
    const editItemModalElement = document.getElementById('editItemModal');
    if (editItemModalElement) {
        // Clean up when modal is hidden
        editItemModalElement.addEventListener('hidden.bs.modal', function() {
            // Only clean up if we're not transitioning to the delete modal
            if (!document.querySelector('.preserve-backdrop')) {
                // Force complete cleanup
                setTimeout(() => {
                    const allBackdrops = document.querySelectorAll('.modal-backdrop');
                    allBackdrops.forEach(backdrop => {
                        backdrop.remove();
                    });
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                }, 150);
            }
        });

        // Add click handler to the save button to ensure proper cleanup
        const saveButton = editItemModalElement.querySelector('.btn.btn-primary');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                // Force cleanup after a short delay
                setTimeout(cleanupModalBackdrop, 300);
            });
        }

        // Add click handler to the delete item button
        const deleteItemBtn = document.getElementById('deleteItemBtn');
        if (deleteItemBtn) {
            deleteItemBtn.addEventListener('click', function() {
                // Store reference to the backdrop
                const backdrop = document.querySelector('.modal-backdrop');

                // Add a class to preserve the backdrop during transition
                if (backdrop) {
                    backdrop.classList.add('preserve-backdrop');
                }

                // Hide the edit modal without removing the backdrop
                editItemModal._element.classList.remove('show');
                setTimeout(() => {
                    editItemModal._element.style.display = 'none';

                    // Show the delete confirmation modal
                    const deleteItemModal = new bootstrap.Modal(document.getElementById('deleteItemModal'));
                    deleteItemModal.show();

                    // Make sure body stays in modal-open state
                    document.body.classList.add('modal-open');
                }, 150);
            });
        }
    }

    // Delete Item Modal Functionality
    const deleteItemModal = document.getElementById('deleteItemModal');
    if (deleteItemModal) {
        // Clean up when modal is hidden
        deleteItemModal.addEventListener('hidden.bs.modal', function() {
            // Force complete cleanup of all backdrops
            setTimeout(() => {
                const allBackdrops = document.querySelectorAll('.modal-backdrop');
                allBackdrops.forEach(backdrop => {
                    backdrop.remove();
                });
                document.body.classList.remove('modal-open');
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }, 150);
        });

        // Add click handler to the confirm delete button
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', function() {
                // Get the currently editing item
                const menuItemRow = document.querySelector('.menu-item-row.currently-editing');
                if (menuItemRow) {
                    const itemName = menuItemRow.querySelector('.menu-item-name').textContent;
                    const categoryItem = menuItemRow.closest('.category-item');

                    // Add fade-out class for animation
                    menuItemRow.classList.add('fade-out');

                    // Wait for animation to complete before removing from DOM
                    setTimeout(() => {
                        // Remove the item from DOM
                        menuItemRow.remove();

                        // Update item count for the category
                        updateCategoryItemCount(categoryItem);

                        // Show item removed toast notification
                        if (typeof showItemRemovedToast === 'function') {
                            showItemRemovedToast();
                        }

                        // Check if we need to show empty state
                        if (typeof checkAndShowEmptyState === 'function') {
                            checkAndShowEmptyState();
                        }

                        console.log(`Deleted item: ${itemName}`);
                    }, 300);

                    // Remove focus from the button before hiding the modal
                    confirmDeleteBtn.blur();

                    // Hide the modal
                    bootstrap.Modal.getInstance(deleteItemModal).hide();

                    // Completely remove all backdrops after item deletion
                    setTimeout(() => {
                        const allBackdrops = document.querySelectorAll('.modal-backdrop');
                        allBackdrops.forEach(backdrop => {
                            backdrop.remove();
                        });
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }, 350);
                }
            });
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
});

// Import the Bootstrap bundle
//
// This includes Popper and all of Bootstrap's JS plugins, but now it's included from the html
// import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

//
// custom JS here
//
// Create an example popover
document.querySelectorAll('[data-bs-toggle="popover"]')
  .forEach(popover => {
    new bootstrap.Popover(popover)
  })

  document.addEventListener("DOMContentLoaded", function () {
    // Update button on page load
    updateButtonTextOnLoad();

    // Attach event listener to menu links
    document.querySelectorAll('.link-menu a').forEach(menuLink => {
        menuLink.addEventListener('click', function (e) {
            const target = this.getAttribute('data-target');

            // Handle submenu toggling
            if (this.classList.contains('toggle')) {
                const submenu = this.nextElementSibling;
                submenu.classList.toggle('open');
                this.classList.toggle('open');
            }

            // Remove active class from all menu items
            document.querySelectorAll('.link-menu a').forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            // Hide all content sections
            document.querySelectorAll('.content-nested-dropdown > div').forEach(content => content.classList.remove('active'));

            // Show the target content
            if (target) {
                document.getElementById(target).classList.add('active');
            }

            // Automatically open parent menus if active
            openParentMenus(this);

            // Update the button with the active menu text
            updateButtonText(this.textContent);
        });
    });
});

// Function to update the button text with the active menu item text
function updateButtonText(activeText) {
    const button = document.querySelector('.btn-show-article-menu-mobile');
    if (button) {
        button.textContent = activeText; // Change button text to match active menu link
    }
}

// Function to set button text based on active menu item when the page loads
function updateButtonTextOnLoad() {
    const activeLink = document.querySelector('.link-menu a.active'); // Find the active menu item

    // Check if an active link exists before updating the button
    if (activeLink) {
        updateButtonText(activeLink.textContent);
    } else {
        console.warn("No active menu item found on page load.");
    }
}


function openParentMenus(activeLink) {
    let parent = activeLink.parentElement.parentElement;
    while (parent && parent.classList.contains('submenu')) {
        parent.classList.add('open');
        parent.previousElementSibling.classList.add('open');
        parent = parent.parentElement.parentElement;
    }
}


/* script for table filtering starts here */
/// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const tableFiltering = (() => {
    function initializeTable() {
      toggleColumns('btn-1');
    }
    function toggleColumns(activeButton) {
      // Remove active class from all buttons
      document.querySelectorAll('.d-flex .btn').forEach(button => {
        button.classList.remove('activeTab');
      });

      // Add active class to the clicked button
      
        const activeButtonElement = document.getElementById(activeButton);
        // if (!activeButtonElement) {
        //   console.error(`Button with id "${activeButton}" not found.`);
        //   return; // Exit the function if the button is not found
        // }
      if (activeButtonElement) {
        activeButtonElement.classList.add('activeTab');
      };
      // Hide all columns
      document.querySelectorAll('th, td').forEach(cell => {
        if (cell.classList.contains('btn-1') || cell.classList.contains('btn-2') || cell.classList.contains('btn-3')) {
          cell.classList.add('hidden-column');
        }
      });

      // Show columns corresponding to the active button
      document.querySelectorAll(`.${activeButton}`).forEach(cell => {
        cell.classList.remove('hidden-column');
      });
    }

    function addListeners() {
      document.querySelectorAll('.techniques-table .btn').forEach(button => {
        button.addEventListener('click', function () {
          const buttonId = this.getAttribute('id');
          toggleColumns(buttonId);
        });
      });
    }

    return {
      init: () => {
        initializeTable();
        addListeners();
      },
    };
  })();

  tableFiltering.init();
});
/* script for table filtering ends here */
/* script for the table filtering dropdown Aspect starts here */

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("aspectPopupButton");
  const popup = document.getElementById("aspectPopup");
  const closeButton = document.getElementById("closePopupButton");
  const filterButtons = document.querySelectorAll(".filter-button");
  const dropdownItems = document.querySelectorAll(".dropdown-item.filter");
  const addFilterButton = document.getElementById("addFilterButton");
  const filterContainer = document.querySelector(".filter-nr-container");

  const togglePopup = () => {
    if (popup) {
      popup.classList.toggle("active"); // Toggle the popup active state
      document.body.classList.toggle("popup-opened"); // Toggle class on body
    }

    filterButtons.forEach(btn => btn.classList.remove("activeFilter"));
    filterButtons[0].classList.add("activeFilter");
    document.getElementById("bbtPopupCheckbox").classList.remove("active");
  };

  const closePopup = () => {
    if (popup) {
      popup.classList.remove("active");
      document.body.classList.remove("popup-opened"); // Remove class from body
    }
  };

  if (toggleButton) {
    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup();
    });

    if (closeButton) {
      closeButton.addEventListener("click", closePopup);
    }

    document.addEventListener("click", (event) => {
      if (popup && !popup.contains(event.target) && event.target !== toggleButton) {
        closePopup();
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(btn => btn.classList.remove("activeFilter"));
      button.classList.add("activeFilter");
    });
  });

  if (addFilterButton) {
    addFilterButton.addEventListener("click", () => {
      const activeFilterButton = document.querySelector(".filter-button.activeFilter");
      const activeDropdownItem = document.querySelector(".dropdown-item.filter.activeFilter");

      if (activeDropdownItem) {
        let closestFilterTitle = null;
        let currentElement = activeDropdownItem.previousElementSibling;

        while (currentElement) {
          if (currentElement.classList.contains("filter-title")) {
            closestFilterTitle = currentElement.textContent.trim();
            break;
          }
          currentElement = currentElement.previousElementSibling;
        }

        const filterText = activeDropdownItem.textContent.trim();
        const filterLabel = activeFilterButton.textContent.trim();

        const badge = document.createElement("div");
        badge.className = "badge";
        badge.innerHTML = `
          ${filterLabel} effect op ${closestFilterTitle} ${filterText}
          <span class="badge-close">&times;</span>
        `;

        if (filterContainer) {
          filterContainer.appendChild(badge);
        }
        
        closePopup();

        badge.querySelector(".badge-close").addEventListener("click", () => {
          badge.remove();
        });
      }
    });
  }

  dropdownItems.forEach(item => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      dropdownItems.forEach(i => i.classList.remove("activeFilter"));
      item.classList.add("activeFilter");
    });
  });

  // Select the filter-buttons div
  const filterButtonsDiv = document.querySelector(".filter-buttons");

  // Check if the div exists
  if (filterButtonsDiv) {
    // Add event listener to each button
    const buttons = filterButtonsDiv.querySelectorAll(".filter-button");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        // Remove existing special classes
        filterButtonsDiv.classList.remove("second-btn-active", "third-btn-active");

        // Check which button is clicked and add the appropriate class
        if (button.dataset.filter === "neutraal") {
          filterButtonsDiv.classList.add("second-btn-active");
        } else if (button.dataset.filter === "negatief") {
          filterButtonsDiv.classList.add("third-btn-active");
        }
      });
    });
  }
});



/* script to toggle content in the header starts here  */
document.addEventListener("DOMContentLoaded", function () {
  const toggleText = document.getElementById("collapsible-text");
  const toggleButton = document.getElementById("toggle-button");

  if (toggleButton) {
    toggleButton.addEventListener("click", function (e) {
      e.preventDefault();

      // Toggle expanded state
      const isExpanded = toggleText.classList.toggle("expanded");
      toggleButton.classList.toggle("expanded");

      // Update button text and arrow direction
      if (isExpanded) {
        toggleButton.innerHTML = 'Minder tonen';
      } else {
        toggleButton.innerHTML = 'Meer tonen';
      }
    });
  };
});
/* script to toggle content in the header ends here  */

/* script for the table filtering dropdown BBT starts here */
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("bbtPopupButton");
  const popup = document.getElementById("bbtPopupCheckbox");
  const closeButton = document.getElementById("closePopupCBButton");
  const addFilterButtonCheckbox = document.getElementById("addFilterButtonCheckbox");
  const filterContainer = document.querySelector(".filter-nr-container");
  const checkboxes = document.querySelectorAll(".form-check-input.popup-checkbox");
  const aspectPopup = document.getElementById("aspectPopup");

  // Function to toggle the popup
  const togglePopup = () => {
    if (popup) {
      popup.classList.toggle("active"); // Toggle active class for the popup
      document.body.classList.toggle("popup-opened"); // Toggle class on body
    }
    if (aspectPopup) {
      aspectPopup.classList.remove("active"); // Ensure aspectPopup is closed
    }

    // Uncheck all checkboxes when the popup opens
    checkboxes.forEach(checkbox => checkbox.checked = false);
  };

  // Function to close the popup
  const closePopup = () => {
    if (popup) {
      popup.classList.remove("active");
      document.body.classList.remove("popup-opened"); // Remove class from body
    }
  };

  // Show/hide popup on button click
  if (toggleButton) {
    toggleButton.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePopup();
    });
  }

  // Close popup on close button click
  if (closeButton) {
    closeButton.addEventListener("click", closePopup);
  }

  // Close popup if clicked outside
  document.addEventListener("click", (event) => {
    if (popup && !popup.contains(event.target) && event.target !== toggleButton) {
      closePopup();
    }
  });

  // Handle "Filter toevoegen" button click
  if (addFilterButtonCheckbox) {
    addFilterButtonCheckbox.addEventListener("click", () => {
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          const label = checkbox.nextElementSibling.textContent.trim();

          // Create badge with BBT text and label text
          const badge = document.createElement("div");
          badge.className = "badge";
          badge.innerHTML = `
            BBT: ${label}
            <span class="badge-close">&times;</span>
          `;
          filterContainer.appendChild(badge);

          // Add event listener to remove badge on "x" click
          badge.querySelector(".badge-close").addEventListener("click", () => {
            badge.remove();
          });
        }
      });

      // Close popup
      closePopup();
    });
  }
});

/* script for the table filtering dropdown BBT ends here */


/* filter badge count script starts here */
document.addEventListener("DOMContentLoaded", () => {
  function updateBadgeCount() {
    const filterContainer = document.querySelector('.filter-nr-container');
    const filterNr = document.querySelector('.filter-nr');

    if (!filterContainer) {
      // console.warn('Warning: .filter-nr-container not found.');
      return;
    }

    const badgeCount = filterContainer.querySelectorAll('.badge').length;

    if (filterNr) {
      filterNr.innerHTML = badgeCount > 0 
        ? `Filter (<span>${badgeCount}</span>) leegmaken` 
        : '';
    }
  }

  // Function to wait for the filterContainer to be available
  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }

  // Wait for .filter-nr-container before running the observer
  waitForElement('.filter-nr-container', (filterContainer) => {
    updateBadgeCount(); // Initial count update

    // Set up a MutationObserver to listen for changes in the filter container
    const observer = new MutationObserver(updateBadgeCount);

    // Start observing the target node for mutations
    observer.observe(filterContainer, {
      childList: true, // Monitor addition or removal of child elements
      subtree: false   // Don't watch the entire subtree, just direct children
    });
  });
});

/* filter badge count script starts here */

/* script for playing video starts here */
document.addEventListener('DOMContentLoaded', function () {
  const videoOverlay = document.getElementById('videoOverlay');
  const youtubeVideo = document.getElementById('youtubeVideo');

  if (videoOverlay && youtubeVideo) {
    videoOverlay.addEventListener('click', function () {
      // Remove the overlay
      videoOverlay.remove();

      // Set the src attribute with autoplay enabled
      const videoUrl = youtubeVideo.src.replace("autoplay=0", "autoplay=1");
      youtubeVideo.src = videoUrl;

      // Make the iframe visible
      youtubeVideo.classList.remove('hidden');
    });
  }
});

/* script for playing video ends here */


/* script for the data table checkbox filtering starts here */
document.addEventListener("DOMContentLoaded", () => {
  const filterBlocks = document.querySelectorAll(".filter-block");
  const filterContainer = document.querySelector(".filter-container");

  // Check if filter container exists
  if (filterContainer) {
    // Checkbox functionality
    document.querySelectorAll(".form-check-input").forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        const label = checkbox.nextElementSibling;
        const filterBlock = checkbox.closest(".filter-block");

        // Ensure the checkbox is inside a valid filter block
        if (!filterBlock) {
          // console.error("Error: Checkbox is not inside a .filter-block.");
          return;
        }

        const blockTitleElement = filterBlock.querySelector(".filter-block-title");

        // Ensure the filter block has a valid title
        if (!blockTitleElement) {
          // console.error("Error: No .filter-block-title found in .filter-block.");
          return;
        }

        const blockTitle = blockTitleElement.textContent.trim();

        if (checkbox.checked) {
          // Create badge
          const badge = document.createElement("div");
          badge.className = "badge";
          badge.innerHTML = `
            ${blockTitle}: ${label.innerHTML.trim()}
            <span class="badge-close">&times;</span>
          `;
          filterContainer.appendChild(badge);

          // Add event listener for badge close
          badge.querySelector(".badge-close").addEventListener("click", () => {
            badge.remove();
            checkbox.checked = false; // Uncheck the checkbox
          });
        } else {
          // Remove badge when checkbox is unchecked
          const existingBadge = Array.from(filterContainer.children).find(badge =>
            badge.textContent.includes(label.textContent.trim())
          );
          if (existingBadge) existingBadge.remove();
        }
      });
    });
  } else {
    // console.warn("Warning: .filter-container does not exist on the page.");
  }
});

/* script for the data table checkbox filtering ends here */


document.addEventListener("DOMContentLoaded", () => {
  const filterBlocks = document.querySelectorAll(".filter-block");
  const filterContainer = document.querySelector(".filter-container");

  // Accordion functionality
  filterBlocks.forEach(block => {
    const title = block.querySelector(".filter-block-title");
    const list = block.querySelector(".filter-block-list");

    // Ensure content is open by default
    list.style.maxHeight = `${list.scrollHeight}px`;

    if (title ) {
    title.addEventListener("click", () => {
      if (list.classList.contains("closed")) {
        list.classList.remove("closed");
        title.classList.remove("closed");
        list.style.maxHeight = `${list.scrollHeight}px`;
      } else {
        list.classList.add("closed");
        list.style.maxHeight = 0;
        title.classList.add("closed");
      }
    });
  }
  });

  // Search functionality
  const searchInput = document.querySelector(".search-input");
  const searchDropdown = document.querySelector(".search-dropdown");
  const searchList = document.querySelector(".filter-block-list");
  const searchBlock = document.querySelector(".filter-block.search");

  if (searchInput && searchDropdown && searchBlock && searchList ) {
   
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      if (query) {
        searchDropdown.classList.add("active");
        searchBlock.classList.add("active");
        searchDropdown.querySelectorAll("div").forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(query) ? "block" : "none";
        });
      } else {
        searchDropdown.classList.remove("active");
        searchBlock.classList.remove("active");
      }
    });
  }

  if (searchDropdown) {

  searchDropdown.addEventListener("click", (event) => {
    if (event.target.tagName === "DIV") {
      const selectedText = event.target.textContent.trim();
      searchInput.value = selectedText;
      searchDropdown.classList.remove("active");
      searchBlock.classList.remove("active");
      

      // Create badge
      const badge = document.createElement("div");
      badge.className = "badge";
      badge.innerHTML = `
        Studie: ${selectedText}
        <span class="badge-close">&times;</span>
      `;
      filterContainer.appendChild(badge);

      // Add searched-element
      const searchedElement = document.createElement("div");
      searchedElement.className = "searched-element";
      searchedElement.innerHTML = `
        ${selectedText}
        <button aria-label="Remove">&times;</button>
      `;
      // searchList.appendChild(searchedElement);
      searchBlock.appendChild(searchedElement);

      // Hide the input field
      searchInput.parentElement.style.display = "none";

      // Close badge functionality
      badge.querySelector(".badge-close").addEventListener("click", () => {
        badge.remove();
        searchedElement.remove();
        searchInput.parentElement.style.display = ""; // Remove inline style
        searchList.style.maxHeight = ""; // Remove inline style
        searchInput.value = ""; // Reset the input
      });

      // Close searched-element functionality
      searchedElement.querySelector("button").addEventListener("click", () => {
        searchedElement.remove();
        badge.remove();
        searchInput.parentElement.style.display = ""; // Remove inline style
        searchList.style.maxHeight = ""; // Remove inline style
        searchInput.value = ""; // Reset the input
      });
    }
  });
}

  // Close dropdown when clicking outside
  document.addEventListener("click", (event) => {
    if (searchInput && !searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
      searchDropdown.classList.remove("active");
      searchBlock.classList.remove("active");
    }
  });
});


/* script for one level menu starts here */
document.addEventListener("DOMContentLoaded", function () {
  const menuLinks = document.querySelectorAll(".link-menu-one-level a");
  const contentSections = document.querySelectorAll(".content-dropdown > div");

  function activateMenuItem(menuLink) {
      // Remove 'active' class from all menu items
      menuLinks.forEach(link => link.classList.remove("active"));

      // Add 'active' class to the clicked menu item
      menuLink.classList.add("active");

      // Hide all content sections
      contentSections.forEach(content => content.classList.remove("active"));

      // Show the target content
      const targetId = menuLink.getAttribute("data-target");
      if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
              targetElement.classList.add("active");
          } else {
              console.warn(`Target element with ID "${targetId}" not found.`);
          }
      }

      // Update button text with active menu item text
      updateButtonText(menuLink.textContent);
  }

  function updateButtonText(activeText) {
      const button = document.querySelector(".btn-show-article-menu-mobile");
      if (button) {
          button.textContent = activeText; // Update button text
      }
  }

  function updateButtonTextOnLoad() {
      const activeLink = document.querySelector(".link-menu-one-level a.active");
      if (activeLink) {
          updateButtonText(activeLink.textContent);
      } else if (menuLinks.length > 0) {
          // If no active link exists, set the first menu item as active
          activateMenuItem(menuLinks[0]);
      } else {
          console.warn("No menu items found.");
      }
  }

  // Ensure the correct menu item is selected on page load
  updateButtonTextOnLoad();

  // Add click event to each menu item
  menuLinks.forEach(menuLink => {
      menuLink.addEventListener("click", function (e) {
          e.preventDefault();
          activateMenuItem(this);
      });
  });
});

/* script for one level menu ends here */
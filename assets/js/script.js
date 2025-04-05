document.addEventListener("DOMContentLoaded", function () {
    loadBookmarks();
});

// Hide all options menus on page load
window.addEventListener("load", function () {
    document.querySelectorAll(".options-menu").forEach(menu => {
        menu.style.display = "none";
    });
});

// Load bookmarks from localStorage
function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const container = document.getElementById("bookmarkContainer");

    container.innerHTML = ""; // Clear existing content

    bookmarks.forEach((bookmark, index) => {
        container.appendChild(createBookmarkElement(bookmark.name, bookmark.url, index));
    });
}

// Add new bookmark
function addBookmark() {
    const nameInput = document.getElementById("bookmarkName");
    const urlInput = document.getElementById("bookmarkURL");

    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (!name || !url) {
        alert("Please enter both name and URL.");
        return;
    }

    // Get existing bookmarks
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    // Add new bookmark
    bookmarks.push({ name, url });

    // Save back to localStorage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

    // Reload bookmarks
    loadBookmarks();

    // Clear input fields
    nameInput.value = "";
    urlInput.value = "";
}

let editIndex = null;

// Open edit modal with selected bookmark data
function editBookmark(index) {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const bookmark = bookmarks[index];

    document.getElementById("bookmarkEditName").value = bookmark.name;
    document.getElementById("bookmarkEditURL").value = bookmark.url;
    editIndex = index; // ✅ Store correct index

    // Open modal
    new bootstrap.Modal(document.getElementById("editModal")).show();
}

// Save edited bookmark
function saveBookmark() {
    const name = document.getElementById("bookmarkEditName").value.trim();
    const url = document.getElementById("bookmarkEditURL").value.trim();
    
    if (!name || !url) {
        alert("Both fields are required!");
        return;
    }

    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (editIndex !== null) {
        bookmarks[editIndex] = { name, url };
    }

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    loadBookmarks(); // ✅ Correct function call

    editIndex = null; // Reset index

    // Close modal
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
}

// Create bookmark card
function createBookmarkElement(name, url, index) {
    const tile = document.createElement("div");
    tile.className = "bookmark-card";
    tile.title = name;
    tile.draggable = true;
    tile.setAttribute("ondragstart", "drag(event)");

    // Bookmark Link
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.className = "bookmark-link";

    // Bookmark favicon
    const img = document.createElement("img");
    img.alt = name;
    try{
        img.src = `${new URL(url).origin}/favicon.ico`;
    }
    catch (error){
        console.log("Invalid URL:", error.message);
        img.src = "pic.jpg"; // Default fallback favicon
    }
     // Ensure fallback favicon on error
    img.onerror = function () {
        this.src = "./assets/images/pic.jpg";
    };

    // Bookmark title
    const titleDiv = document.createElement("div");
    titleDiv.className = "bookmark-title";
    titleDiv.textContent = name;

    // Append elements to link
    link.appendChild(img);
    link.appendChild(titleDiv);

    // Three-dot menu button
    const menuButton = document.createElement("button");
    menuButton.className = "bookmark-menu";
    menuButton.innerHTML = "⋮";

    menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleOptions(menuButton);
    });

    // Options menu
    const optionsMenu = document.createElement("div");
    optionsMenu.className = "options-menu";
    optionsMenu.style.display = "none";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () { editBookmark(index); };

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.onclick = function () { deleteBookmark(index); };

    optionsMenu.appendChild(editButton);
    optionsMenu.appendChild(deleteButton);

    tile.appendChild(link);
    tile.appendChild(menuButton);
    tile.appendChild(optionsMenu);

    return tile;
}

// Toggle options menu
function toggleOptions(button) {
    const menu = button.nextElementSibling;

    document.querySelectorAll(".options-menu").forEach((m) => {
        if (m !== menu) m.style.display = "none";
    });

    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Hide options menu when clicking outside
document.addEventListener("click", function (event) {
    document.querySelectorAll(".options-menu").forEach((menu) => {
        if (!menu.contains(event.target) && !menu.previousElementSibling.contains(event.target)) {
            menu.style.display = "none";
        }
    });
});

// Delete bookmark
function deleteBookmark(index) {
    let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    bookmarks.splice(index, 1);

    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    loadBookmarks();
}

// Search bookmarks
function searchBookmarks() {
    let query = document.getElementById("search").value.toLowerCase();
    let bookmarks = document.querySelectorAll(".bookmark-card");

    bookmarks.forEach(bookmark => {
        let title = bookmark.querySelector(".bookmark-title").textContent.toLowerCase();
        
        if (title.includes(query)) {
            bookmark.style.display = "flex"; // Show matching bookmarks
        } else {
            bookmark.style.display = "none"; // Hide non-matching bookmarks
        }
    });
}
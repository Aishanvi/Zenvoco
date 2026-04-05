import os
import re

directories_to_scan = [
    r"c:\Users\aishanvi\OneDrive\Desktop\minor project\web application\web application\zenvoco-frontend\src\pages",
    r"c:\Users\aishanvi\OneDrive\Desktop\minor project\web application\web application\zenvoco-frontend\src\components"
]

replacements = [
    # background
    (r'(?<!dark:)bg-black', r'bg-white dark:bg-black'),
    (r'(?<!dark:)bg-gray-900', r'bg-gray-50 dark:bg-gray-900'),
    (r'(?<!dark:)bg-gray-800', r'bg-gray-100 dark:bg-gray-800'),
    (r'(?<!dark:)bg-gray-950', r'bg-gray-50 dark:bg-gray-950'),
    
    # borders
    (r'(?<!dark:)border-gray-800', r'border-gray-200 dark:border-gray-800'),
    (r'(?<!dark:)border-gray-700', r'border-gray-300 dark:border-gray-700'),
    
    # text
    (r'(?<!dark:)text-white', r'text-gray-900 dark:text-white'),
    (r'(?<!dark:)text-gray-400', r'text-gray-600 dark:text-gray-400'),
    (r'(?<!dark:)text-gray-300', r'text-gray-700 dark:text-gray-300'),
]

skip_files = ['Navbar.jsx', 'ThemeToggle.jsx', 'Welcome.jsx']

for directory in directories_to_scan:
    if not os.path.exists(directory):
        continue
    for filename in os.listdir(directory):
        if filename.endswith(".jsx") and filename not in skip_files:
            filepath = os.path.join(directory, filename)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            new_content = content
            for old, new in replacements:
                new_content = re.sub(old, new, new_content)
            
            if new_content != content:
                print(f"Updated {filename}")
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(new_content)

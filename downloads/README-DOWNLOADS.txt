================================================================================
   PROJECT DOWNLOADS FOLDER (PDF REPORTS & SOLIDWORKS CAD FILES)
================================================================================

This is where you store any files that you want your website visitors,
professors, or recruiters to download!

Examples of files to put in this folder:
1. Your Project Reports:
   - "planetary-gearbox-report.pdf"
   - "fea-bracket-analysis.pdf"
   - "suspension-kinematics-thesis.pdf"

2. Your SolidWorks / 3D CAD files:
   - "gearbox-assembly.SLDASM"
   - "bracket-model.SLDPRT"
   - "robotics-arm-cad.STEP"  <-- (TIP: .STEP files can be opened by ANY CAD software!)
   - "project-cad-package.zip" <-- (TIP: Best way is to ZIP all files together!)

3. Your Resume / CV:
   - "Oshan_Resume_Mechanical_Engineer.pdf"

--------------------------------------------------------------------------------
HOW TO LINK YOUR FILE TO A PROJECT (TAKES 10 SECONDS):
--------------------------------------------------------------------------------
1. Copy your file (e.g. "my-report.pdf") into this "downloads" folder.
2. Open "projects.html" in Notepad.
3. Find your project card and look for:
   data-report="downloads/sample-project-report.pdf"
   and change it to:
   data-report="downloads/my-report.pdf"

4. For CAD files, look for:
   data-cad="downloads/sample-cad-files.zip"
   and change it to:
   data-cad="downloads/my-cad-files.zip"

5. Save the file (Ctrl + S).
Now, whenever anyone clicks "View Specs & Analysis" on your website, two shiny
buttons will appear:
   [ DOWNLOAD PDF REPORT 📄 ]
   [ DOWNLOAD 3D CAD (.STEP / SolidWorks) 💾 ]

Anyone clicking the buttons will immediately download your files!
================================================================================

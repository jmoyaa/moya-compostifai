const path = require('path');
const { app, BrowserWindow, ipcMain, Menu, screen } = require('electron');
const isDEV= process.env.NODE_ENV !== 'development'

// // Function to create a new BrowserWindow with DevTools open
// function createWindowWithDevTools(options) {
//     const window = new BrowserWindow(options);
//     if (isDEV) {
//         window.webContents.openDevTools();
//     }
//     return window;
// }

let mainWindow;
let StandardcompostingWindow;
let MaturedcompostingWindow;
let guideWindow;
let historyWindow;
let methodWindow;





function createMainWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    if (mainWindow) {
        mainWindow.show();
    } else {
        mainWindow = new BrowserWindow({
            title: 'compostifAI',
            width: width,
            height: height,
            fullscreen:true,
            frame: false, 
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            },
            
        });

        mainWindow.webContents.setZoomFactor(1.0);
        mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
        Menu.setApplicationMenu(null);

        

        mainWindow.on('closed', () => {
            mainWindow = null;
        });

        
    }
}


function createStandardCompostingWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    if (StandardcompostingWindow) {
        StandardcompostingWindow.show();
    } else {
        StandardcompostingWindow = new BrowserWindow({
            title: 'Standard - compostifAI',
            width: width,
            height: height,
            alwaysOnTop: true, 
            frame:false,
           
         
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            },
          

            
        });

        StandardcompostingWindow.loadFile(path.join(__dirname,'./renderer/composting_standard.html'));
        Menu.setApplicationMenu(null);

        

        StandardcompostingWindow.on('closed', () => {
            StandardcompostingWindow = null;
            if (StandardcompostingWindow && !StandardcompostingWindow.isDestroyed()) {
                StandardcompostingWindow.show();
            }
        });
      
    }
}

function createMaturedCompostingWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    if (MaturedcompostingWindow) {
        MaturedcompostingWindow.show();
    } else {
        MaturedcompostingWindow = new BrowserWindow({
            title: 'Matured - compostifAI',
            width: width,
            height: height,
            alwaysOnTop: true, 
            frame:false,
          
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            },
      
          

           
        });

        MaturedcompostingWindow.loadFile(path.join(__dirname,'./renderer/composting_matured.html'));
        Menu.setApplicationMenu(null);

        MaturedcompostingWindow.on('closed', () => {
            MaturedcompostingWindow = null;
            if (MaturedcompostingWindow && !MaturedcompostingWindow.isDestroyed()) {
                MaturedcompostingWindow.show();
            }
        });

         // Open Devtools if in de environment

        //  if(isDEV) {
        //     MaturedcompostingWindow.webContents.openDevTools()
        // }
    }
}




function createGuideWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    if (guideWindow) {
        guideWindow.show();
    } else {
        guideWindow = new BrowserWindow({
            title: 'Guide - compostifAI',
            width: width,
            height: height,
            fullscreen:true,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            },
           
        });

        guideWindow.loadFile(path.join(__dirname, './renderer/guide.html'));
        Menu.setApplicationMenu(null);

        guideWindow.on('closed', () => {
            guideWindow = null;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.show();
            }
        });
    }
}


function createHistoryWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    
    if (historyWindow) {
        historyWindow.show();
    } else {
        historyWindow = new BrowserWindow({
            title: 'History - compostifAI',
            width: width,
            height: height,
            fullscreen:true,
            frame: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js')
            },
        });

        historyWindow.loadFile(path.join(__dirname, './renderer/history.html'));
        Menu.setApplicationMenu(null);

        historyWindow.on('closed', () => {
            historyWindow = null;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.show();
            }
            
        });
    }
}


function createMethodWindow() {
    if (methodWindow) {
        methodWindow.show();
        methodWindow.focus(); 
    } else {
        methodWindow = new BrowserWindow({
            width: 800,
            height: 700,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                preload: path.join(__dirname, 'preload.js'),
                touchEvents: true
            },
            frame: false,
            parent: mainWindow, 
            modal: true, 
            alwaysOnTop: true, 
        });

        methodWindow.loadFile(path.join(__dirname, './renderer/method.html'));
        Menu.setApplicationMenu(null);

        methodWindow.on('closed', () => {
            methodWindow = null;
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.show();
            }
        });

        
    }
}


app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (!mainWindow) {
            createMainWindow();
        }
    });

    ipcMain.on('startButtonClick', createMethodWindow);
    ipcMain.on('guideButtonClick', createGuideWindow);
    ipcMain.on('historyButtonClick', createHistoryWindow);
    ipcMain.on('standardButtonClick', createStandardCompostingWindow);
    ipcMain.on('maturedButtonClick', createMaturedCompostingWindow);
 

});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



ipcMain.on('goToMainWindow', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show();
    } else {
        createMainWindow();
    }

    
     if (StandardcompostingWindow && !StandardcompostingWindow.isDestroyed()) {
        StandardcompostingWindow.minimize();
        StandardcompostingWindow.once('minimize', () => {
            const isMinimized = StandardcompostingWindow.isMinimized();
            mainWindow.webContents.send('compostingWindowStatus', isMinimized);
        });
    } else {

        mainWindow.webContents.send('compostingWindowStatus', false);
    }

    if ( MaturedcompostingWindow && ! MaturedcompostingWindow.isDestroyed()) {
        MaturedcompostingWindow.minimize();
        MaturedcompostingWindow.once('minimize', () => {
            const isMinimized = MaturedcompostingWindow.isMinimized();
            mainWindow.webContents.send('compostingWindowStatus', isMinimized);
        });
    } else {

        mainWindow.webContents.send('compostingWindowStatus', false);
    }
    

    if (guideWindow && !guideWindow.isDestroyed()) {
        guideWindow.close();
    }

    if (historyWindow && !historyWindow.isDestroyed()) {
        historyWindow.close();
    }

    if (methodWindow && !methodWindow.isDestroyed()) {
        methodWindow.close();
    }
});



ipcMain.on('closeCompostingWindow', () => {
    if (StandardcompostingWindow && !StandardcompostingWindow.isDestroyed()) {
        StandardcompostingWindow.close();
       
        // ipc message saying standard window is closed
        mainWindow.webContents.send('compostingWindowClosed');
    }
    if (MaturedcompostingWindow && !MaturedcompostingWindow.isDestroyed()) {
        MaturedcompostingWindow.close();
       
        // this is also ipc message for matured saying matured window is closed
        mainWindow.webContents.send('compostingWindowClosed');
    }
});



ipcMain.on('saveDataAndClose', (event, sensorData) => {
    // Save the received sensor data here

    // Send the sensor data to history.html
    if (historyWindow && !historyWindow.isDestroyed()) {
        historyWindow.webContents.send('sensorData', sensorData);
    }

   
});




ipcMain.on('compostingButtonClick', () => {
    if (StandardcompostingWindow && !StandardcompostingWindow.isDestroyed()) {
        if (StandardcompostingWindow.isMinimized()) {
            StandardcompostingWindow.restore(); // Restore the minimized window
        } else {
            StandardcompostingWindow.focus();
        }
    } else if (MaturedcompostingWindow && !MaturedcompostingWindow.isDestroyed()) {
        if (MaturedcompostingWindow.isMinimized()) {
            MaturedcompostingWindow.restore(); // Restore the minimized window
        } else {
            MaturedcompostingWindow.focus();
        }
    } else {
        // If no composting window exists or all windows are destroyed,
        // re-enable the composting button in the main window
        mainWindow.webContents.send('enableCompostingButton');
    }
});






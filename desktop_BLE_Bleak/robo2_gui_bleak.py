from multiprocessing import Process, Queue
import asyncio
import sys
import bleak_uart_ifq

import PySimpleGUI as sg

def worker(qtx, qrx):
    
    tab1_layout  = [
        [sg.Column(
            [
                [
                    sg.Button('↖', font=('Arial',40), size=(3, 1), key='Button1'),
                    sg.Button('↑', font=('Arial',40), size=(3, 1), key='Button2'),
                    sg.Button('↗', font=('Arial',40), size=(3, 1), key='Button3')
                ]
            ], justification='c')
        ],
        [sg.Column(
            [
                [
                    sg.Button('⟲', font=('Arial',40), size=(3, 1), key='Button4'),
                    sg.Button(' ', font=('Arial',40), size=(3, 1), key='Button5'),
                    sg.Button('⟳', font=('Arial',40), size=(3, 1), key='Button6')
                ]
            ], justification='c')
        ],
        [sg.Column(
            [
                [
                    sg.Button('↙', font=('Arial',40), size=(3, 1), key='Button7'),
                    sg.Button('↓', font=('Arial',40), size=(3, 1), key='Button8'),
                    sg.Button('↘', font=('Arial',40), size=(3, 1), key='Button9')
                ]
            ], justification='c')
        ],
    ]

    tab2_layout = [
        [sg.Column(
            [     
                [sg.Frame('Top View',
                    [
                        [
                            sg.Text('Right leg',size=(22,1)),
                            sg.Text('Left leg',size=(20,1)),
                        ],
                        [
                            sg.Slider(key='-RightLeg-', range=(80,100), default_value=90, resolution=1, disable_number_display=False, orientation='h', size=(20, None), enable_events=True),
                            sg.Slider(key='-LeftLeg-', range=(80,100), default_value=90, resolution=1, disable_number_display=False, orientation='h', size=(20, None), enable_events=True)
                        ]
                    ])
                ]
            ], justification='c')
        ],
        [sg.Column(
            [     
                [sg.Frame('Front View',
                    [
                        [
                            sg.Text('Right foot',size=(22,1)),sg.Text('Left foot',size=(20,1)),
                        ],
                        [
                            sg.Slider(key='-RightFoot-', range=(80,100), default_value=90, resolution=1, disable_number_display=False, orientation='h', size=(20, None), enable_events=True),
                            sg.Slider(key='-LeftFoot-', range=(80,100), default_value=90, resolution=1, disable_number_display=False, orientation='h', size=(20, None), enable_events=True)
                        ]
                    ])
                ]
            ], justification='c')
        ],
        [sg.Column([[sg.Button('UPDATE', key='-update-')]], justification='c')],
        [sg.Text('',size=(22,1), key='-leftleg-')],
        [sg.Text('',size=(22,1), key='-leftfoot-')],
        [sg.Text('',size=(22,1), key='-rightleg-')],
        [sg.Text('',size=(22,1), key='-rightfoot-')],
    ]

    layout = [
        [
            sg.TabGroup(
                [
                    [
                        sg.Tab('PANEL', tab1_layout, key="tab1"),
                        sg.Tab('ADJUST', tab2_layout, key="tab2"),
                    ]
                ], key="tab_group", enable_events=True)
        ],
    ]

    while True:
        item = qrx.get()
        if item == 'conected':
            break
        elif item == 'notfound':
            sys.exit(1)

    window = sg.Window(
        title='BLE control panel for Biped Robot',
        layout=layout
    )
    window.finalize()

    button1 = window['Button1']
    button2 = window['Button2']
    button3 = window['Button3']
    button4 = window['Button4']
    button5 = window['Button5']
    button6 = window['Button6']
    button7 = window['Button7']
    button8 = window['Button8']
    button9 = window['Button9']

    button1.bind('<ButtonPress>', " Press", propagate=False)
    button2.bind('<ButtonPress>', " Press", propagate=False)
    button3.bind('<ButtonPress>', " Press", propagate=False)
    button4.bind('<ButtonPress>', " Press", propagate=False)
    button5.bind('<ButtonPress>', " Press", propagate=False)
    button6.bind('<ButtonPress>', " Press", propagate=False)
    button7.bind('<ButtonPress>', " Press", propagate=False)
    button8.bind('<ButtonPress>', " Press", propagate=False)
    button9.bind('<ButtonPress>', " Press", propagate=False)

    button1.bind('<ButtonRelease>', " Release", propagate=False)
    button2.bind('<ButtonRelease>', " Release", propagate=False)
    button3.bind('<ButtonRelease>', " Release", propagate=False)
    button4.bind('<ButtonRelease>', " Release", propagate=False)
    button5.bind('<ButtonRelease>', " Release", propagate=False)
    button6.bind('<ButtonRelease>', " Release", propagate=False)
    button7.bind('<ButtonRelease>', " Release", propagate=False)
    button8.bind('<ButtonRelease>', " Release", propagate=False)
    button9.bind('<ButtonRelease>', " Release", propagate=False)

    def check_cmd(event):
        cmds = [
            ['Button1', 'forward_left', 'stop'],
            ['Button2', 'forward', 'stop'],
            ['Button3', 'forward_right', 'stop'],
            ['Button4', 'turn_left', 'stop'],
            ['Button5', 'stop', 'stop'],
            ['Button6', 'turn_right', 'stop'],
            ['Button7', 'backward_left', 'stop'],
            ['Button8', 'backward', 'stop'],
            ['Button9', 'backward_right', 'stop']
        ]
        args = event.split(' ')
        if len(args) == 2:
            for cmd in cmds:
                if args[0] == cmd[0]:
                    if args[1] == 'Press':
                        return cmd[1]
                    elif args[1] == 'Release':
                        return cmd[2]
        return ''

    while True:
        event, values = window.read(timeout=100,timeout_key='-timeout-')

        if event == sg.WIN_CLOSED:
            break
    
        elif event in '-timeout-':
            if qrx.qsize() != 0:
                rxstr = qrx.get()
            #    print('rxstr', rxstr)
                paras = rxstr.split(' ')
                if paras[0] == 'ri':
                    angles = paras[1].split(',')
                    if len(angles) == 4:
                        window['-RightLeg-'].Update(180 - int(angles[2]))
                        window['-RightFoot-'].Update(int(angles[3]))
                        window['-LeftLeg-'].Update(180 - int(angles[0]))
                        window['-LeftFoot-'].Update(int(angles[1]))
                        window['-leftleg-'].Update('leg_left_angle_init = ' + angles[0])
                        window['-leftfoot-'].Update('foot_left_angle_init = ' + angles[1])
                        window['-rightleg-'].Update('leg_right_angle_init = ' + angles[2])
                        window['-rightfoot-'].Update('foot_right_angle_init = ' + angles[3])
                elif rxstr == 'quit':
                    break   # exit loop --> window close

        elif event in '-update-':
            rl = int(180 - values['-RightLeg-'])
            rf = int(values['-RightFoot-'])
            ll = int(180 - values['-LeftLeg-'])
            lf = int(values['-LeftFoot-'])
            txstr = 'si ' + str(ll) + ',' + str(lf) + ',' + str(rl) + ',' + str(rf) + ''
            qtx.put(txstr)
            window['-leftleg-'].Update('leg_left_angle_init = ' + str(ll))
            window['-leftfoot-'].Update('foot_left_angle_init = ' + str(lf))
            window['-rightleg-'].Update('leg_right_angle_init = ' + str(rl))
            window['-rightfoot-'].Update('foot_right_angle_init = ' + str(rf))

        elif event=="tab_group":
            select_tab = values["tab_group"]
            if select_tab=="tab2":
                qtx.put('get angles_init')

        ans = check_cmd(event)
        if ans != '':
            qtx.put(ans)

    qtx.put('quit')

    window.close()

    print('done worker')


if __name__ == "__main__":
    qtx = Queue()
    qrx = Queue()
    process = Process(target=worker, args=(qtx, qrx, ))
    process.start()

    ble = bleak_uart_ifq.ble_uart(qtx, qrx, ["mpy-uart", "BBC micro:bit"])

    try:
        asyncio.run(ble.uart_ifq())
    except asyncio.CancelledError:
        # task is cancelled on disconnect, so we ignore this error
        pass

    process.join()

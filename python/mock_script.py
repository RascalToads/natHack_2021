import call_server

call_server.make_all_calls(
    brow_up=True,
    brow_down=True,
    blink=True,
    eye=True,
    wink_left=True,
    wink_right=True,
    concentration=True,
    percent_concentration=1,
)

call_server.make_all_calls(
    brow_up=False,
    brow_down=False,
    blink=False,
    eye=False,
    wink_left=False,
    wink_right=False,
    concentration=False,
    percent_concentration=100,
)

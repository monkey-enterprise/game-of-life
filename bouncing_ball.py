import curses
import time

BALL = "O"
FRAME_DELAY = 0.05


def step(x, y, dx, dy, width, height):
    """Advance the ball one frame, reversing direction at the edges."""
    if not 0 <= x + dx < width:
        dx = -dx
    if not 0 <= y + dy < height:
        dy = -dy
    return x + dx, y + dy, dx, dy


def run(stdscr):
    curses.curs_set(0)
    stdscr.nodelay(True)

    x, y, dx, dy = 0, 0, 1, 1
    while stdscr.getch() not in (ord("q"), ord("Q")):
        height, width = stdscr.getmaxyx()
        # Avoid the bottom-right cell: writing there raises curses.error.
        width, height = max(width - 1, 1), max(height, 1)
        x, y = min(x, width - 1), min(y, height - 1)
        x, y, dx, dy = step(x, y, dx, dy, width, height)

        stdscr.erase()
        stdscr.addstr(y, x, BALL)
        stdscr.refresh()
        time.sleep(FRAME_DELAY)


def main():
    curses.wrapper(run)


if __name__ == "__main__":
    main()

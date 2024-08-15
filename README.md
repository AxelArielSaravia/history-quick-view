### ![History Quick View](./media/promotion/marquee.png)
v0.4.0

created by Axel Ariel Saravia

---

### History Quick view
[*History quick view*](https://chromewebstore.google.com/detail/history-quick-view/ednfjcijimijfccmlfbeejidmbekdmic)
is a simple chrome extensions for use and manage simple tasks with your browser history data.

This extension is created for my own necessities. If you have some bugs or you need other utilities please contact me.

### Some of the usabilities are:
- see your most current history, but you can navigate all your history.
- delete a history url.
- delete a complete history day data.
- search a history query.
- search by date
- shortcut button to the browser history manager
- shortcut button to the browser history data cleaner

### Some user configurations:
- You can set if the url opens in the current tab or in a new tab.
- You can specify when a new tab is opens, go to it (focus it) or stay in your current tab.

### Keyboard shortcuts:

| Command | Description |
| --- | ---|
| <kbd>Tab</kbd> | Normal navigation |
| <kbd>s</kbd> | focus search input |
| <kbd>Ctrl</kbd> + <kbd>q</kbd> | on search input, removes the search input text|
| <kbd>r</kbd> | on item, remove the item |
| <kbd>Shift</kbd> + <kbd>r</kbd> | on item, remove the complete day range |
| <kbd>Ctrl</kbd> + <kbd>Enter</kbd> | on item, opens the item in a contrary way of the configurations |
| <kbd>Ctrl</kbd> + <kbd>mouse click</kbd> | on item, opens the item in a contrary way of the configurations |
| <kbd>Shift</kbd> + <kbd>Enter</kbd> | on item, opens the item in a new windows |
| <kbd>Shift</kbd> + <kbd>mouse click</kbd> | on item, opens the item in a new windows |
| <kbd>Ctrl</kbd> + <kbd>q</kbd> | close any kind of modal |
| <kbd>m</kbd> | open or close the "more modal" |
| <kbd>k</kbd> | open or close the "keyboard modal" |

### Search by date

This feature allows you to start your search from a specific date,
including that date and all previous records. It’s like saying,
"search from this date to the past". We cannot search the future,
so if it’s a **relative date query** we search in the past. However,
if it’s a **strict date query** set beyond the current date, it will
be considered an **invalid date query**.

Everything that does not follow the queries listed below is invalid.

#### Search query:

- `yesterday` or `y`

- **week days**: If a week day is beyond the current date, it returns
that day from the previous week.

    `mo` `tu` `we` `th` `fr` `sa` `su`
    `monday` `tuesday` `wednesday` `thursday` `friday` `saturday` `sunday`

- **month names**: If the month is beyond the current date, it returns
that month from the previous year.

    `Jan` `Feb` `Mar` `Apr` `May` `Jun` `Jul` `Aug` `Sep` `Oct` `Nov` `Dec`
    `January` `February` `March` `April` `May` `June` `July` `August` `September` `October` `November` `December`

- **partial date expressions**: If the date is beyond the current date, it returns
that date form the previous year.

    `<day-number> <month-name>` `<month-name> <day-number>`

    Example: "2 Aug", "Feb 22", "3 October"

- **full date expressions**: This is an **strict date query**. If the date is
beyond the current date, it will be considered **invalid**.

    `<day-number> <month-name> <year-number>` `<month-name> <day-number> <year-number>`

    Example: "2 Aug 2023", "Feb 22 2021", "3 October 2021"

- **date calculation expressions**: This expression calc how many days,
weeks, months or years to search from the current date to the pass.
The `-` (negative sign) is required at beginnig. If no `period` is
specified, the default is `day`.

    `-<number>` `-<number> <period>`

    period:
    - `d` `day` `days` (values: 1..730)
    - `w` `week` `weeks` (values: 1..240)
    - `m` `month` `months` (values: 1..120)
    - `y` `year` `years` (values: 1..10)

    Example: "-1", "-3 m", "-1 year", "-5 weeks"

---

The icons used in the extension are from 
[Feather Icons](https:f//feathericons.com/) and
[Lucide](https://lucide.dev/).

The inspiration of this extension comes from the [Edge Browser](https://www.microsoft.com/en-us/edge) history extension.

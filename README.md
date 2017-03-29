# qsearcher
Get vocab terms from quizlet from an input file.
<p align="center">
	<a href="https://asciinema.org/a/9d2h61kxhb45by465ojzcgbl8"><img src="terminal.png" alt="qseacher video" /></a>
</p>


## Use case
Have an APUSH review to do? Put all the terms into a text file and we will get definitions for you from multiple quizlet sets.

## Install
```
npm install -g qsearcher
```
* Note: may require sudo

## Usage
```
Usage: qsearcher <file> [options]
Options:
	-s [search term] default: "apush"
example: qsearcher vocab.txt -s "history"
```

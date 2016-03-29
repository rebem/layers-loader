import Start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import clean from 'start-clean';
import eslint from 'start-eslint';
import env from 'start-env';
import read from 'start-read';
import babel from 'start-babel';
import write from 'start-write';

import findPort from './port';
import demoTask from './demo';

const minPort = 3000;
const maxPort = 3010;
const start = Start(reporter());

export function lint() {
    return start(
        files('**/*.js'),
        eslint()
    );
}

export function demo() {
    return start(
        env('development'),
        findPort({ minPort, maxPort }, port => start(
            demoTask({ port })
        ))
    );
}

export function build() {
    return start(
        files('build/'),
        clean(),
        files('src/**/*.js'),
        read(),
        env('production'),
        babel(),
        write('build/')
    );
}

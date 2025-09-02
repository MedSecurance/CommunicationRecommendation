:- module(run_validator, [run/4]).

:- use_module(library(readutil)).
:- use_module(library(filesex)).  % for exists_file/1

% Entry point
run(NetworkName, Protocol, Threshold, Status) :-
    validate_evidence(NetworkName, Protocol, Threshold, Status).

% Executes the Python validator and processes the result
validate_evidence(NetworkName, Protocol, Threshold, Status) :-
    format(atom(Command), 'python3 evidence_validator.py "~w" "~w" "~w"',
        [NetworkName, Protocol, Threshold]),
    (   shell(Command, ResultCode)
    ->  (   ResultCode =:= 0
        ->  process_validation_result(Status)
        ;   format('~n*** Python script failed with code ~w ', [ResultCode]),
            Status = ongoing
        )
    ;   format('~n*** Error: Failed to execute Python script~n', []),
        Status = ongoing
    ).

% Reads result from file and sets Status
process_validation_result(Status) :-
    ResultFile = 'REPOSITORY/EVIDENCE/result_latest.txt',
    format('~n*** Python script executed successfully~n', []),
    (   exists_file(ResultFile)
    ->  open(ResultFile, read, Stream),
        read_string(Stream, _, ResultString),
        close(Stream),
        normalize_space(string(Trimmed), ResultString),
        (   Trimmed == "true"  -> Status = valid
        ;   Trimmed == "false" -> Status = invalid
        ;   Status = ongoing
        ),
        format('~n*** Constraint Evaluation Result: ~s~n', [Status])
    ;   format('~n*** Error: ~w not found~n', [ResultFile]),
        Status = ongoing
    ).

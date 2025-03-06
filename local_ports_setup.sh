#! /bin/bash

if [ "$#" -le 3 ];then
    echo "all options are required"
    exit 0
fi

while [[ $# -gt 0 ]]
    do
        key="$1"
        case $key in
            -d)
                if [[ "$2" = "default" ]];then
                    DEVICE="emulator-5554" 
                else
                    DEVICE="$2"
                fi
                shift
                shift
                ;;
            -p)
                if [[ "$2" = "default" ]];then
                    PORT="8080" 
                else
                    PORT="$2"
                fi
                shift
                shift
                ;;
        esac
done

adb -s "$DEVICE" reverse tcp:"$PORT" tcp:"$PORT"

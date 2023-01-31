package main

import (
	"fmt"
	"sync"
)

type token struct {
	message  string
	dest     int
	transNum int
}

var wg sync.WaitGroup

func send_message(current_thread_index int, recieved_channel chan token, to_send_channel chan token) {
	for {
		message := <-recieved_channel
		fmt.Println("Thread ", current_thread_index, ": message was received: ", message.message, ".")

		if message.transNum == 0 {
			fmt.Println("Thread ", current_thread_index, ": number of transmissions has ended")
			wg.Done()
		}

		if message.dest == current_thread_index {
			fmt.Println("Thread ", current_thread_index, ": message has reached its destination")
			wg.Done()
		}

		if message.transNum > 0 {
			message.transNum -= 1
			to_send_channel <- message
		}
	}
}

func main() {

	var myToken token
	var threadsNum int

	fmt.Println("Enter the number of threads")
	fmt.Scanln(&threadsNum)
	fmt.Println("Enter your message")
	fmt.Scanln(&myToken.message)
	fmt.Println("Enter the number of the recipient thread")
	fmt.Scanln(&myToken.dest)
	fmt.Println("Enter the number of transmissions")
	fmt.Scanln(&myToken.transNum)

	var channels []chan token = make([]chan token, threadsNum)

	for i := 0; i < threadsNum; i++ {
		channels[i] = make(chan token)
	}

	wg.Add(1)

	for i := 0; i < threadsNum; i++ {
		if i == threadsNum-1 {
			go send_message(i, channels[i], channels[i])
		} else {
			go send_message(i, channels[i], channels[i+1])
		}
	}

	if myToken.dest > len(channels)-1 {
		myToken.dest = len(channels) - 1
	}

	channels[0] <- myToken

	wg.Wait()

	for i := 0; i < threadsNum; i++ {
		close(channels[i])
	}
}

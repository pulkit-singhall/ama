import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function HomeCarousel() {
    let items = [`What's your favourite holiday destination?`,
        `Let's watch a movie together`,
        `I've discovered the secret to happiness: pizza and good company.`,
        `Guess who is this?`,
        `Decided to dance like no one's watching in my room. Best decision ever!`
    ]
    return (
        <Carousel className="w-full max-w-md">
            <CarouselContent className="flex flex-row items-center">
                {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                    <div className="rounded-md m-auto p-5 flex items-center
                        justify-center bg-blue-950">
                        <p className="m-3 text-xl font-serif text-white p-1">
                            {items[index]}
                        </p>
                    </div>
                </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}
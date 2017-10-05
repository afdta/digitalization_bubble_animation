library(tidyverse)


dat <- read_csv("/home/alec/Projects/Brookings/digitalization/build/data/initial_handoff/sifan/ForAlec.csv")

head(dat)
table(dat$high02)
s <- dat$high16 + dat$medium16 + dat$low16
unique(s)

dat2 <- dat %>% mutate(dsl02=(high02)+(2*medium02)+(3*low02), dsl16=(high16)+(2*medium16)+(3*low16))  

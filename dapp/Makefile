CXX  := g++

.PHONY: clean 3rdparty

ENGINE_SRC := $(wildcard engine/*.cpp)
UINT256_SRC := uint256_t/uint256_t.cpp uint256_t/uint128_t/uint128_t.cpp

dapp: dapp.cpp $(UINT256_SRC) ${ENGINE_SRC}
	make -C 3rdparty
	$(CXX) -pthread -std=c++11 -o $@ $^

clean:
	@rm -rf dapp
	make -C 3rdparty clean
